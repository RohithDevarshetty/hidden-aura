'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-scroll feature
  useEffect(() => {
    let animationFrameId: number | null = null;
    let isAutoScrolling = true;

    const startTime = Date.now();
    const scrollDuration = 35000; // 35 seconds total scroll duration
    const maxScroll = window.innerHeight * 1.2; // Scroll distance

    const handleManualScroll = () => {
      isAutoScrolling = false;
      setAutoScroll(false);
      window.removeEventListener('wheel', handleManualScroll);
      window.removeEventListener('touchmove', handleManualScroll);
    };

    const autoScrollFunction = () => {
      if (!isAutoScrolling) return;

      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / scrollDuration, 1);

      // Easing function (ease-out-cubic) for smooth deceleration
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentScroll = easeProgress * maxScroll;

      window.scrollTo(0, currentScroll);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(autoScrollFunction);
      } else {
        isAutoScrolling = false;
        setAutoScroll(false);
      }
    };

    // Start auto-scroll
    animationFrameId = requestAnimationFrame(autoScrollFunction);

    // Listen for user scroll/wheel to stop auto-scroll
    window.addEventListener('wheel', handleManualScroll);
    window.addEventListener('touchmove', handleManualScroll);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('wheel', handleManualScroll);
      window.removeEventListener('touchmove', handleManualScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-nord-0 via-nord-0 to-nord-1 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-nord-2/20 bg-nord-0/80 backdrop-blur-md h-[60px]">
        <div className="container mx-auto px-4 lg:px-8 h-full flex justify-between items-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-frost-1 via-accent to-frost-0 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-cooper)' }}>
            HiddenAura
          </div>
          <div className="flex gap-3 items-center">
            {status === 'authenticated' && session?.user?.name ? (
              <>
                <span className="text-xs lg:text-sm text-snow-0">@{session.user.name}</span>
                <Link href="/dashboard">
                  <Button className="rounded-full px-6 bg-frost-1 hover:bg-frost-0 text-nord-0 transition-all duration-300">
                    Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="rounded-full text-snow-0 hover:text-frost-1 transition-colors">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="rounded-full px-6 bg-gradient-to-r from-frost-1 to-accent hover:shadow-lg hover:shadow-frost-1/30 transition-all duration-300">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* News Ticker */}
      <div className="fixed top-[60px] left-0 right-0 z-40 w-full bg-gradient-to-r from-frost-1/10 via-accent/10 to-frost-1/10 border-b border-frost-1/20 py-2 overflow-hidden backdrop-blur-sm">
        <div className="scrolling-text text-xs lg:text-sm text-frost-1 font-medium px-4">
          <span>✨ No passwords needed&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚀 Share profiles instantly&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🎨 Beautiful story templates&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;💬 Anonymous feedback&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span>✨ No passwords needed&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🚀 Share profiles instantly&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🎨 Beautiful story templates&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;💬 Anonymous feedback&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 lg:px-8 pt-40 pb-20 overflow-hidden">
        {/* Dramatic Radial Gradient Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-30"
            style={{
              background: 'radial-gradient(circle, rgba(136, 192, 208, 0.4) 0%, rgba(139, 0, 139, 0.2) 100%)',
            }}
          />
          <div className="absolute bottom-20 right-20 w-[400px] h-[400px] rounded-full blur-3xl bg-frost-1/10" />
          <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full blur-3xl bg-accent/5" />
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-frost-1/10 border border-frost-1/30 backdrop-blur-sm animate-slide-in-up">
            <div className="w-2 h-2 rounded-full bg-frost-1 animate-pulse" />
            <span className="text-xs lg:text-sm font-medium text-frost-1">Anonymous Questions & Answers</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-heading font-bold text-snow-2 leading-tight lg:leading-tight animate-slide-in-up-delay-1">
            Anonymous{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-frost-1 via-accent to-frost-0 bg-clip-text text-transparent">
                confessions
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-frost-1 to-accent blur-2xl opacity-20 -z-10" />
            </span>
         
          </h1>

          {/* Subheading */}
          <p className="text-lg lg:text-xl text-snow-0 max-w-2xl mx-auto leading-relaxed animate-slide-in-up-delay-2">
            Get anonymous questions and answers from your community. Share your story images on Instagram and engage with your audience.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 animate-slide-in-up-delay-3">
            <Link href="/register">
              <Button
                size="lg"
                className="rounded-full px-8 py-6 text-base lg:text-lg bg-gradient-to-r from-frost-1 to-accent hover:shadow-2xl hover:shadow-frost-1/40 transition-all duration-300 hover:scale-105 active:scale-95 font-semibold"
              >
                Start Free Now
              </Button>
            </Link>
            <Link href="/explore">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 py-6 text-base lg:text-lg border-snow-0/20 hover:bg-nord-2/40 hover:border-frost-1/50 transition-all duration-300 hover:scale-105 active:scale-95 font-semibold"
              >
                Explore Community
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 lg:gap-12 pt-8 text-sm text-snow-0 animate-slide-in-up-delay-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-frost-1 animate-pulse" />
              <span>100% Private</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span>No Passwords</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-frost-0 animate-pulse" />
              <span>Instant Setup</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-16 lg:py-24 px-4 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          {/* Section Header */}
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-snow-2">
              Three simple steps
            </h2>
            <p className="text-lg text-snow-0 max-w-2xl mx-auto">
              Get started in seconds and start collecting feedback instantly
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                num: '01',
                title: 'Create Account',
                desc: 'Choose a username and get your unique profile link instantly',
                icon: '🔗'
              },
              {
                num: '02',
                title: 'Share Link',
                desc: 'Download beautiful story images and share with your followers',
                icon: '🎨'
              },
              {
                num: '03',
                title: 'Collect Answers',
                desc: 'Receive anonymous questions and answers from your community',
                icon: '💬'
              }
            ].map((step, i) => (
              <div
                key={i}
                className="group relative p-8 rounded-2xl border border-nord-2/30 bg-gradient-to-br from-nord-2/10 to-nord-1/10 backdrop-blur-sm hover:border-frost-1/50 hover:bg-gradient-to-br hover:from-frost-1/5 hover:to-accent/5 transition-all duration-300 hover:shadow-lg hover:shadow-frost-1/10"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-frost-1 to-accent flex items-center justify-center font-bold text-nord-0 text-sm group-hover:scale-110 transition-transform duration-300">
                  {step.num}
                </div>

                <div className="mt-6 space-y-4">
                  <div className="text-4xl">{step.icon}</div>
                  <h3 className="text-xl font-bold text-snow-2">{step.title}</h3>
                  <p className="text-snow-0 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-16 lg:py-24 px-4 lg:px-8 bg-gradient-to-b from-transparent via-nord-2/5 to-transparent">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-snow-2">
              Powerful Features
            </h2>
            <p className="text-lg text-snow-0 max-w-2xl mx-auto">Everything you need to engage with your community</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: '🔒 100% Anonymous', desc: 'Complete privacy for both question creators and answerers' },
              { title: '🎨 Beautiful Templates', desc: 'Create stunning Instagram story images with customizable styles' },
              { title: '⚡ Instant Setup', desc: 'No email verification required, start in seconds' },
              { title: '📱 Mobile Optimized', desc: 'Perfect experience on all devices and screen sizes' },
              { title: '🔔 Real-time Updates', desc: 'Get notified instantly when you receive new answers' },
              { title: '🚀 Fast & Reliable', desc: 'Built on modern technology for performance and stability' }
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border border-nord-2/30 bg-nord-2/20 backdrop-blur-sm hover:border-frost-1/50 hover:bg-nord-2/30 transition-all duration-300 group cursor-pointer"
              >
                <h3 className="text-lg font-bold text-snow-2 group-hover:text-frost-1 transition-colors">{feature.title}</h3>
                <p className="text-snow-0 text-sm mt-2">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 lg:py-24 px-4 lg:px-8">
        <div className="container mx-auto max-w-3xl">
          <div className="relative rounded-3xl border border-frost-1/30 bg-gradient-to-br from-nord-2/40 to-nord-1/40 backdrop-blur-md p-12 lg:p-16 text-center space-y-8 overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-frost-1/10 via-transparent to-accent/10 opacity-50" />

            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-snow-2">
                  Ready to get started?
                </h2>
                <p className="text-base lg:text-lg text-snow-0 max-w-xl mx-auto leading-relaxed">
                  Create your free account and start collecting honest feedback from your community today. No credit card required.
                </p>
              </div>

              <Link href="/register">
                <Button
                  size="lg"
                  className="rounded-full px-10 py-6 text-lg bg-gradient-to-r from-frost-1 to-accent hover:shadow-2xl hover:shadow-frost-1/50 transition-all duration-300 hover:scale-105 active:scale-95 font-semibold"
                >
                  Create Free Account →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-nord-2/20 bg-gradient-to-t from-nord-1/20 to-transparent backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-xl font-bold bg-gradient-to-r from-frost-1 to-accent bg-clip-text text-transparent mb-4">
                HiddenAura
              </div>
              <p className="text-snow-0 text-sm">Collect honest feedback from your community anonymously.</p>
            </div>
            <div className="space-y-3">
              <p className="text-snow-2 font-semibold text-sm">Links</p>
              <div className="space-y-2 text-sm">
                <Link href="/explore" className="text-snow-0 hover:text-frost-1 transition-colors block">
                  Explore
                </Link>
                <Link href="/login" className="text-snow-0 hover:text-frost-1 transition-colors block">
                  Sign In
                </Link>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-snow-2 font-semibold text-sm">Legal</p>
              <div className="space-y-2 text-sm">
                <Link href="/privacy" className="text-snow-0 hover:text-frost-1 transition-colors block">
                  Privacy
                </Link>
                <Link href="/terms" className="text-snow-0 hover:text-frost-1 transition-colors block">
                  Terms
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-nord-2/20 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-snow-0 text-sm">© 2025 HiddenAura. All rights reserved.</p>
            <div className="flex gap-6 text-snow-0 text-sm">
              <a href="#" className="hover:text-frost-1 transition-colors">Twitter</a>
              <a href="#" className="hover:text-frost-1 transition-colors">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
