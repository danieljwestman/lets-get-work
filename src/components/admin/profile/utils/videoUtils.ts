
// Helper function to format video URL for display
export const formatVideoUrlDisplay = (url: string | null): string => {
  if (!url || url.trim() === '') return 'Not set';
  
  // Check for different video platforms
  if (url.includes('tella.tv')) {
    return 'Tella video available';
  }
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'YouTube video available';
  }
  if (url.includes('vimeo.com')) {
    return 'Vimeo video available';
  }
  if (url.includes('loom.com')) {
    return 'Loom video available';
  }
  
  // Generic video URL
  return 'Video available';
};
