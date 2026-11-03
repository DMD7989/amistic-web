// Réduit une photo avant son envoi : les photos de téléphone font souvent plusieurs Mo,
// ce qui ralentirait le site pour tous les visiteurs.
const MAX_SIDE = 1600;
const SMALL_ENOUGH = 400 * 1024;

export async function shrinkImage(file: File): Promise<File> {
  if (typeof createImageBitmap === 'undefined' || file.type === 'image/svg+xml') return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size <= SMALL_ENOUGH) return file;

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    // Les logos PNG gardent leur transparence ; les photos passent en JPEG
    const type = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.82));
    if (!blob || blob.size >= file.size) return file;
    const ext = type === 'image/png' ? 'png' : 'jpg';
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.' + ext, { type });
  } catch {
    return file;
  }
}
