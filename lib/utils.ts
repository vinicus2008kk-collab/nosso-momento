export function formatRelationshipDuration(startDate: Date) {
  const now = new Date();
  const diffMs = now.getTime() - startDate.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  const remainingDays = days % 30;

  return `${years} anos, ${months} meses e ${remainingDays} dias`;
}

export function buildPublicUrl(slug: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}/momento/${slug}`;
}
