
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";
import { useOpportunityTranslations } from "@/hooks/useOpportunityTranslations";
import { useOpportunity } from "@/contexts/OpportunityContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { ResponsiveTitle } from "@/components/shared/ResponsiveTitle";
import { VideoPlayer } from "@/components/shared/VideoPlayer";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  intro_video_url_en: string | null;
  intro_video_url_sv: string | null;
  full_name: string | null;
}

export const AboutSection = () => {
  const { t } = useOpportunityTranslations();
  const { opportunity } = useOpportunity();
  const { language } = useLanguage();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!opportunity?.user_id) {
        setLoadingProfile(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('intro_video_url_en, intro_video_url_sv, full_name')
          .eq('id', opportunity.user_id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
        } else {
          setUserProfile(data);
          console.log('Profile data loaded:', data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [opportunity?.user_id]);

  const getCurrentVideoUrl = () => {
    if (!userProfile) return null;
    
    // Return video URL based on current language, fallback to English if Swedish not available
    if (language === 'sv' && userProfile.intro_video_url_sv) {
      return userProfile.intro_video_url_sv;
    }
    
    return userProfile.intro_video_url_en;
  };

  const currentVideoUrl = getCurrentVideoUrl();
  const hasVideo = currentVideoUrl !== null && currentVideoUrl !== undefined && currentVideoUrl.trim() !== '';

  const handleVideoClick = () => {
    console.log('Video click handler called', { hasVideo, currentVideoUrl });
    if (hasVideo) {
      setIsVideoOpen(true);
    } else {
      console.log('No video URL available');
    }
  };

  console.log('AboutSection render:', { hasVideo, currentVideoUrl, userProfile, language });

  return (
    <section id="about" className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <ResponsiveTitle
          titleKey="about.title"
          mobileTitleKey="about.titleMobile"
          className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
        />
        <p className="text-base text-gray-600 text-center mb-12 max-w-3xl mx-auto leading-relaxed">
          {t('about.description')}
        </p>
        
        {/* Mobile: Video first, then content */}
        <div className="block lg:hidden mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden mb-6">
            <CardContent className="p-0">
              <div 
                className="relative aspect-video flex items-center justify-center group cursor-pointer bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400"
                onClick={handleVideoClick}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300"></div>
                <div className="relative z-10 text-center text-white">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-all duration-300">
                    <Play className="w-6 h-6 ml-1" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{t('about.videoTitle')}</h3>
                  <p className="text-sm opacity-90">{t('about.videoDescription')}</p>
                </div>
                <div className="absolute top-4 left-4 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
                <div className="absolute bottom-6 right-6 w-1.5 h-1.5 bg-white/40 rounded-full animate-ping"></div>
                <div className="absolute top-1/3 right-8 w-1 h-1 bg-white/50 rounded-full animate-bounce"></div>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Content Section */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-gray-800">
                  {t('about.contentTitleMobile')}
                </h3>
                <div className="space-y-4 text-gray-600 text-sm md:text-base">
                  <p>{t('about.contentParagraph1')}</p>
                  <p>{t('about.contentParagraph2')}</p>
                  <p className="text-sm italic border-l-2 border-purple-200 pl-3 bg-purple-50/50 py-2 rounded-r">
                    {t('about.contentParagraph3Mobile')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Desktop: Side by side layout with equal heights */}
        <div className="hidden lg:block">
          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            {/* Video Section - Desktop */}
            <div className="order-2 lg:order-1">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden h-full">
                <CardContent className="p-0 h-full">
                  <div 
                    className="relative flex items-center justify-center group h-full cursor-pointer bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400"
                    onClick={handleVideoClick}
                  >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300"></div>
                    <div className="relative z-10 text-center text-white">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-all duration-300">
                        <Play className="w-8 h-8 ml-1" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{t('about.videoTitle')}</h3>
                      <p className="text-sm opacity-90">{t('about.videoDescription')}</p>
                    </div>
                    <div className="absolute top-4 left-4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-6 right-6 w-2 h-2 bg-white/40 rounded-full animate-ping"></div>
                    <div className="absolute top-1/3 right-8 w-1 h-1 bg-white/50 rounded-full animate-bounce"></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content Section - Desktop with matching height */}
            <div className="order-1 lg:order-2 flex">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 flex-1">
                <CardContent className="p-8 h-full flex flex-col justify-center">
                  <h3 className="text-2xl font-semibold mb-6 text-gray-800">{t('about.contentTitle')}</h3>
                  <div className="space-y-4 text-gray-600">
                    <p>{t('about.contentParagraph1')}</p>
                    <p>{t('about.contentParagraph2')}</p>
                    <p className="text-sm italic border-l-2 border-purple-200 pl-3 bg-purple-50/50 py-2 rounded-r">
                      {t('about.contentParagraph3')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      <VideoPlayer
        videoUrl={currentVideoUrl}
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        title={`${userProfile?.full_name || 'Introduction'} - ${t('about.videoTitle')}`}
      />
    </section>
  );
};
