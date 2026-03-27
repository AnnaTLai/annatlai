export function getLanguageFromURL(pathname: string): string {
  const langCodeMatch = pathname.match(/^\/([a-z]{2})\//);
  return langCodeMatch ? langCodeMatch[1] : 'en';
}

export function getPathFromURL(pathname: string): string {
  const pathnameMatch = pathname.match(/^\/[a-z]{2}\/(.*)/);
  return pathnameMatch ? pathnameMatch[1] : pathname;
} 