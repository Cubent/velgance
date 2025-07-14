import { Button } from '@repo/design-system/components/ui/button';
import { Check, MoveRight, Star, Shield, Zap, Users, Database, Globe, GitBranch } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const Enterprise = () => {
  // CSS keyframes for wave animations
  const waveStyles = `
    @keyframes wave1 {
      0%, 100% { transform: rotate(-5deg) scale(1.2) translateX(0px) translateY(0px); }
      25% { transform: rotate(-3deg) scale(1.25) translateX(10px) translateY(-5px); }
      50% { transform: rotate(-7deg) scale(1.15) translateX(-5px) translateY(10px); }
      75% { transform: rotate(-4deg) scale(1.3) translateX(15px) translateY(-8px); }
    }
    @keyframes wave2 {
      0%, 100% { transform: rotate(3deg) scale(1.1) translateX(0px) translateY(0px); }
      33% { transform: rotate(5deg) scale(1.2) translateX(-8px) translateY(12px); }
      66% { transform: rotate(1deg) scale(1.05) translateX(12px) translateY(-6px); }
    }
    @keyframes wave3 {
      0%, 100% { transform: translateX(0px) translateY(0px) scale(1); }
      50% { transform: translateX(-10px) translateY(15px) scale(1.1); }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: waveStyles }} />
  <div className="w-full min-h-screen relative -mt-20 pt-20" style={{ backgroundColor: '#161616', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
    <div
      className="max-w-7xl mx-auto relative"
      style={{
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: 'transparent',
        paddingLeft: '3rem',
        paddingRight: '3rem',
        paddingTop: '5rem',
        paddingBottom: '4rem'
      }}
    >

    {/* Hero Section */}
    <div className="w-full relative overflow-hidden">
      <div className="flex flex-col items-center justify-center gap-8 pb-8 lg:pb-12">
          <div className="flex flex-col gap-6">
            <h1 className="max-w-4xl mx-auto text-center font-regular text-4xl tracking-tighter md:text-6xl lg:text-7xl">
              Enterprise AI Agent for Code at Scale
            </h1>
            <p className="max-w-3xl mx-auto text-center text-lg text-muted-foreground leading-relaxed tracking-tight md:text-xl">
              Deploy a secure, self-hosted AI that accelerates your engineering teams. It collaborates natively within your workflows, learns from your codebase, and delivers production-ready solutions.
            </p>
          </div>
          
          {/* Key Features Pills */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <div className="bg-neutral-800/70 border border-neutral-600 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
              Full-cycle automation
            </div>
            <div className="bg-neutral-800/70 border border-neutral-600 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
              Company-specific customization
            </div>
            <div className="bg-neutral-800/70 border border-neutral-600 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
              On-premise deployment
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button
              size="lg"
              className="relative overflow-hidden text-white px-8 py-6 text-lg border-0"
              style={{
                background: 'linear-gradient(135deg, #5F9EA0 0%, #D8A2C8 50%, #FF8C00 100%)',
                backgroundSize: '200% 200%',
                animation: 'gradient 3s ease infinite'
              }}
              asChild
            >
              <Link href="/contact">
                <span className="relative z-10 flex items-center gap-2">Contact us <MoveRight className="h-5 w-5" /></span>
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
                    mixBlendMode: 'overlay'
                  }}
                />
              </Link>
            </Button>
          </div>
        </div>
    </div>

    {/* Stats Section */}
    <div className="w-full py-20 lg:py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-regular tracking-tighter md:text-4xl mb-8">
            AI is changing software development<br />
            — is your team ready?
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div
              className="text-4xl font-bold mb-2 relative inline-block"
              style={{
                background: 'linear-gradient(135deg, #5F9EA0 0%, #D8A2C8 50%, #FF8C00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              90%
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter1'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter1)' opacity='0.4'/%3E%3C/svg%3E")`,
                  mixBlendMode: 'overlay'
                }}
              />
            </div>
            <p className="text-muted-foreground">
              of enterprise software engineers will use AI code assistants by 2028 <span className="text-sm">(Gartner)</span>
            </p>
          </div>
          <div className="text-center">
            <div
              className="text-4xl font-bold mb-2 relative inline-block"
              style={{
                background: 'linear-gradient(135deg, #5F9EA0 0%, #D8A2C8 50%, #FF8C00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              69%
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter2)' opacity='0.4'/%3E%3C/svg%3E")`,
                  mixBlendMode: 'overlay'
                }}
              />
            </div>
            <p className="text-muted-foreground">
              of CxOs say they are shipping software at least 2× faster <span className="text-sm">(GitLab)</span>
            </p>
          </div>
          <div className="text-center">
            <div
              className="text-4xl font-bold mb-2 relative inline-block"
              style={{
                background: 'linear-gradient(135deg, #5F9EA0 0%, #D8A2C8 50%, #FF8C00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              82%
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter3'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter3)' opacity='0.4'/%3E%3C/svg%3E")`,
                  mixBlendMode: 'overlay'
                }}
              />
            </div>
            <p className="text-muted-foreground">
              of developers are currently using AI tools for code writing <span className="text-sm">(Statista)</span>
            </p>
          </div>
        </div>
    </div>

    {/* AI Agent Features Section */}
    <div className="w-full py-20 lg:py-32 bg-neutral-900/20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-regular tracking-tighter md:text-4xl mb-4">
            AI Agent engineered for Enterprise software development
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Database
                  className="h-6 w-6"
                  style={{
                    background: 'linear-gradient(135deg, #5F9EA0 0%, #D8A2C8 50%, #FF8C00 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                />
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter4'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter4)' opacity='0.4'/%3E%3C/svg%3E")`,
                    mixBlendMode: 'overlay'
                  }}
                />
              </div>
              <h3 className="text-xl font-semibold">Understands your codebase & context</h3>
            </div>
            <p className="text-muted-foreground">
              Cubent deeply analyzes your company's repository, fetching relevant data for each task—ensuring smarter suggestions and more accurate automation.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {['Workspace', 'Codebase', 'Databases', 'Files', 'Documentation', 'Web', '...'].map((item) => (
                <span key={item} className="bg-neutral-800/50 text-white px-3 py-1 rounded text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <GitBranch
                  className="h-6 w-6"
                  style={{
                    background: 'linear-gradient(135deg, #5F9EA0 0%, #D8A2C8 50%, #FF8C00 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                />
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter5'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter5)' opacity='0.4'/%3E%3C/svg%3E")`,
                    mixBlendMode: 'overlay'
                  }}
                />
              </div>
              <h3 className="text-xl font-semibold">Integrates with developers' tools</h3>
            </div>
            <p className="text-muted-foreground">
              Connect with GitHub, GitLab, Docker, PostgreSQL, MySQL, and more—handling related operations autonomously, mimicking your workflow.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Zap
                  className="h-6 w-6"
                  style={{
                    background: 'linear-gradient(135deg, #5F9EA0 0%, #D8A2C8 50%, #FF8C00 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                />
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter6'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter6)' opacity='0.4'/%3E%3C/svg%3E")`,
                    mixBlendMode: 'overlay'
                  }}
                />
              </div>
              <h3 className="text-xl font-semibold">Leverages the best AI models</h3>
            </div>
            <p className="text-muted-foreground">
              Choose from industry-leading LLMs—including Claude 4, GPT-4o, Grok, Gemini, DeepSeek, Mistral and more—or switch models to optimize performance.
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <span className="text-sm text-muted-foreground">Claude 3.7 Sonnet</span>
              <span className="text-sm text-muted-foreground">GPT-4o</span>
              <span className="text-sm text-muted-foreground">Grok</span>
              <span className="text-sm text-muted-foreground">Gemini</span>
              <span className="text-sm text-muted-foreground">DeepSeek</span>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Users
                  className="h-6 w-6"
                  style={{
                    background: 'linear-gradient(135deg, #5F9EA0 0%, #D8A2C8 50%, #FF8C00 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                />
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter7'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter7)' opacity='0.4'/%3E%3C/svg%3E")`,
                    mixBlendMode: 'overlay'
                  }}
                />
              </div>
              <h3 className="text-xl font-semibold">Fine-tuned for your company</h3>
            </div>
            <p className="text-muted-foreground">
              Train Cubent on your specific coding style and stack, improving accuracy over time—unlike generic AI models.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="bg-neutral-800/70 border-neutral-600 text-white hover:bg-neutral-700/70"
            asChild
          >
            <Link href="/contact">
              See Cubent in action
            </Link>
          </Button>
        </div>
    </div>

    {/* Empower Engineers Section */}
    <div className="w-full py-20 lg:py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-regular tracking-tighter md:text-4xl mb-4">
            Empower your engineers with Cubent Agent
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Technical leaders choose Cubent Agent to empower engineers to work faster, onboard quickly, and ship products without delays
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          <div className="text-center">
            <div
              className="relative rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(95, 158, 160, 0.1) 0%, rgba(216, 162, 200, 0.1) 50%, rgba(255, 140, 0, 0.1) 100%)',
                border: '1px solid rgba(95, 158, 160, 0.2)'
              }}
            >
              <span
                className="font-bold text-lg relative z-10"
                style={{
                  background: 'linear-gradient(135deg, #5F9EA0 0%, #D8A2C8 50%, #FF8C00 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >01</span>
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter8'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter8)' opacity='0.4'/%3E%3C/svg%3E")`,
                  mixBlendMode: 'overlay'
                }}
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">Understands large codebases</h3>
            <p className="text-muted-foreground text-sm">
              No matter how complex your repositories are, Cubent Agent selects the right context to deliver accurate solutions.
            </p>
          </div>

          <div className="text-center">
            <div
              className="relative rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(95, 158, 160, 0.1) 0%, rgba(216, 162, 200, 0.1) 50%, rgba(255, 140, 0, 0.1) 100%)',
                border: '1px solid rgba(95, 158, 160, 0.2)'
              }}
            >
              <span
                className="font-bold text-lg relative z-10"
                style={{
                  background: 'linear-gradient(135deg, #5F9EA0 0%, #D8A2C8 50%, #FF8C00 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >02</span>
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter9'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter9)' opacity='0.4'/%3E%3C/svg%3E")`,
                  mixBlendMode: 'overlay'
                }}
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">Continuously improves</h3>
            <p className="text-muted-foreground text-sm">
              Learns from each interaction and feedback with your developers, updating its memory and becoming smarter over time.
            </p>
          </div>

          <div className="text-center">
            <div
              className="relative rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(95, 158, 160, 0.1) 0%, rgba(216, 162, 200, 0.1) 50%, rgba(255, 140, 0, 0.1) 100%)',
                border: '1px solid rgba(95, 158, 160, 0.2)'
              }}
            >
              <span
                className="font-bold text-lg relative z-10"
                style={{
                  background: 'linear-gradient(135deg, #5F9EA0 0%, #D8A2C8 50%, #FF8C00 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >03</span>
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter10'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter10)' opacity='0.4'/%3E%3C/svg%3E")`,
                  mixBlendMode: 'overlay'
                }}
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">Organizes experience into a knowledge base</h3>
            <p className="text-muted-foreground text-sm">
              Builds a shared memory from developers' interactions, speeding up collaboration across your team.
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-6">
            Get dedicated support from our team—available at every stage, from setup to fine-tuning and beyond.
          </p>
          <Button
            size="lg"
            className="relative overflow-hidden text-white border-0"
            style={{
              background: 'linear-gradient(135deg, #5F9EA0 0%, #D8A2C8 50%, #FF8C00 100%)',
              backgroundSize: '200% 200%'
            }}
            asChild
          >
            <Link href="/contact">
              <span className="relative z-10">Try Cubent today</span>
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter11'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter11)' opacity='0.4'/%3E%3C/svg%3E")`,
                  mixBlendMode: 'overlay'
                }}
              />
            </Link>
          </Button>
        </div>
    </div>

    {/* Gartner Recognition Section */}
    <div className="w-full py-20 lg:py-32 bg-neutral-900/20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-regular tracking-tighter md:text-4xl mb-6">
            The only Open-source AI Code Assistant for Enterprise recognized by Gartner
          </h2>
          <div className="max-w-4xl mx-auto">
            <blockquote className="text-lg text-muted-foreground italic mb-4">
              "With Cubent, users can choose from a wide range of models both for cloud and self-hosted versions, allowing them to tailor the AI assistant to their specific needs, <strong>balancing performance, accuracy and computational requirements.</strong>"
            </blockquote>
            <cite
              className="font-semibold relative inline-block"
              style={{
                background: 'linear-gradient(135deg, #5F9EA0 0%, #D8A2C8 50%, #FF8C00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              — Gartner
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter12'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter12)' opacity='0.4'/%3E%3C/svg%3E")`,
                  mixBlendMode: 'overlay'
                }}
              />
            </cite>
          </div>
        </div>
    </div>

    {/* Deployment Options Section */}
    <div className="w-full py-20 lg:py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-regular tracking-tighter md:text-4xl mb-4">
            Deploy AI agent on-premise, as SaaS, or on AWS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-neutral-900/30 backdrop-blur-sm rounded-xl p-6 border border-neutral-700/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <Shield
                  className="h-6 w-6"
                  style={{
                    background: 'linear-gradient(135deg, #5F9EA0 0%, #D8A2C8 50%, #FF8C00 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                />
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter13'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter13)' opacity='0.4'/%3E%3C/svg%3E")`,
                    mixBlendMode: 'overlay'
                  }}
                />
              </div>
              <h3 className="text-xl font-semibold">On-Premise</h3>
            </div>
            <p className="text-muted-foreground">
              Complete privacy of your code and data, with LLMs fine-tuned for your specific stack.
            </p>
          </div>

          <div className="bg-neutral-900/30 backdrop-blur-sm rounded-xl p-6 border border-neutral-700/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <Globe
                  className="h-6 w-6"
                  style={{
                    background: 'linear-gradient(135deg, #5F9EA0 0%, #D8A2C8 50%, #FF8C00 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                />
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter14'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter14)' opacity='0.4'/%3E%3C/svg%3E")`,
                    mixBlendMode: 'overlay'
                  }}
                />
              </div>
              <h3 className="text-xl font-semibold">SaaS</h3>
            </div>
            <p className="text-muted-foreground">
              Fast cloud-based setup, ready to scale with your team.
            </p>
          </div>

          <div className="bg-neutral-900/30 backdrop-blur-sm rounded-xl p-6 border border-neutral-700/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <Zap
                  className="h-6 w-6"
                  style={{
                    background: 'linear-gradient(135deg, #5F9EA0 0%, #D8A2C8 50%, #FF8C00 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                />
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter15'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter15)' opacity='0.4'/%3E%3C/svg%3E")`,
                    mixBlendMode: 'overlay'
                  }}
                />
              </div>
              <h3 className="text-xl font-semibold">AWS</h3>
            </div>
            <p className="text-muted-foreground">
              Scalable and secure deployment in your Amazon Web Services Infrastructure.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <div
            className="relative rounded-lg p-6 max-w-3xl mx-auto overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(95, 158, 160, 0.1) 0%, rgba(216, 162, 200, 0.1) 50%, rgba(255, 140, 0, 0.1) 100%)',
              border: '1px solid rgba(95, 158, 160, 0.2)'
            }}
          >
            <p
              className="font-semibold mb-2 relative z-10"
              style={{
                background: 'linear-gradient(135deg, #5F9EA0 0%, #D8A2C8 50%, #FF8C00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Cubent sees 1.5x Price Performance as the First AI Coding Assistant on AWS Inferentia2
            </p>
            <Button
              variant="outline"
              className="relative overflow-hidden border-0"
              style={{
                border: '1px solid rgba(95, 158, 160, 0.3)',
                background: 'linear-gradient(135deg, rgba(95, 158, 160, 0.1) 0%, rgba(216, 162, 200, 0.1) 50%, rgba(255, 140, 0, 0.1) 100%)',
                color: '#5F9EA0'
              }}
              asChild
            >
              <Link href="#" target="_blank" rel="noopener noreferrer">
                <span className="relative z-10">Read the Case Study</span>
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter16'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter16)' opacity='0.4'/%3E%3C/svg%3E")`,
                    mixBlendMode: 'overlay'
                  }}
                />
              </Link>
            </Button>
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter17'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter17)' opacity='0.4'/%3E%3C/svg%3E")`,
                mixBlendMode: 'overlay'
              }}
            />
          </div>
        </div>
    </div>

    {/* Final CTA Section */}
    <div className="w-full py-20 lg:py-32">
        <div className="text-center">
          <h2 className="text-3xl font-regular tracking-tighter md:text-4xl mb-6">
            Empower your developers with AI Agent
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Bring your engineers an AI teammate that deeply understands your codebase, integrates into your workflows, and accelerates development—while keeping your data fully secure and under your control.
          </p>
          <Button
            size="lg"
            className="relative overflow-hidden text-white px-8 py-6 text-lg border-0"
            style={{
              background: 'linear-gradient(135deg, #5F9EA0 0%, #D8A2C8 50%, #FF8C00 100%)',
              backgroundSize: '200% 200%'
            }}
            asChild
          >
            <Link href="/contact">
              <span className="relative z-10 flex items-center gap-2">Contact us <MoveRight className="h-5 w-5" /></span>
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter18'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter18)' opacity='0.4'/%3E%3C/svg%3E")`,
                  mixBlendMode: 'overlay'
                }}
              />
            </Link>
          </Button>
        </div>
    </div>
    </div>
  </div>
    </>
  );
};

export default Enterprise;
