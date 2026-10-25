import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n/index.jsx';
import { registerUser } from '../lib/api.js';

export default function Onboarding() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [lifeStage, setLifeStage] = useState('adult');
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState(false);

  useEffect(() => {
    // For demo: Always show onboarding by clearing localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userLifeStage');
    localStorage.removeItem('userLogs');
    setStep(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContinue = async () => {
    console.log('handleContinue called, step:', step);

    if (step === 1 && !name.trim()) {
      // Don't allow proceeding without a name
      setNameError(true);
      setTimeout(() => setNameError(false), 400);
      return;
    }

    if (step < 2) {
      console.log('Moving to step 2');
      setStep(step + 1);
    } else {
      console.log('Finishing onboarding, navigating to home');
      // Demo mode: Skip API registration and use localStorage
      setIsLoading(true);
      try {
        // Simulate API delay for demo purposes
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Use a fixed demo user ID for Priya
        const demoUserId = 'demo-user-priya';
        localStorage.setItem('userId', demoUserId);
        localStorage.setItem('userName', name);
        localStorage.setItem('userAge', '19'); // Demo age for Priya
        localStorage.setItem('userLifeStage', lifeStage);

        console.log('Demo user registered:', { name, age: 19, lifeStage });
        console.log('localStorage userId:', localStorage.getItem('userId'));
      } catch (error) {
        console.error('Failed to register user:', error);
      } finally {
        setIsLoading(false);
      }

      console.log('Calling navigate to /');
      window.location.href = '/';
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="w-full max-w-[430px] mx-auto flex flex-col min-h-screen px-5 py-6 justify-between bg-[#f9f9f9]">
      <header className="w-full flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="w-12 h-12 rounded-full bg-white border-[2.5px] border-black shadow-[4px_4px_0px_#000000] flex items-center justify-center hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
          >
            <span className="material-symbols-outlined text-black">arrow_back</span>
          </button>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[#9d4235] text-[24px]" style={{ fontVariationSettings: 'FILL 1' }}>
              spa
            </span>
            <span className="text-[24px] font-black tracking-tight text-black">Kaya</span>
          </div>
          <div className="px-4 py-1 rounded-full bg-white border-[2.5px] border-black shadow-[2px_2px_0px_#000000] flex items-center justify-center">
            <span className="text-[11px] font-black uppercase tracking-wider text-black">
              Step {step} of 2
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 pt-1">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-3 rounded-full border-[2.5px] border-black shadow-[2px_2px_0px_#000000] transition-all ${
                s === step ? 'w-12 bg-[#EE8070]' : s < step ? 'w-3 bg-[#EE8070]' : 'w-3 bg-[#ffdbcf]'
              }`}
            ></div>
          ))}
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center py-6 gap-6">
        {step === 1 && (
          <>
            <div className="flex justify-center items-center">
              <div className="relative w-36 h-36 rounded-full bg-[#ffdbcf] border-[2.5px] border-black shadow-[4px_4px_0px_#000000] flex items-center justify-center">
                <div className="absolute -top-1 -right-2 w-8 h-8 rounded-full bg-[#EE8070] border-[2.5px] border-black shadow-[2px_2px_0px_#000000] flex items-center justify-center">
                  <span className="material-symbols-outlined text-black text-[15px]" style={{ fontVariationSettings: 'FILL 1' }}>
                    favorite
                  </span>
                </div>
                <div className="absolute -bottom-1 -left-2 w-7 h-7 rounded-full bg-white border-[2.5px] border-black shadow-[2px_2px_0px_#000000] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#9d4235] text-[13px]">arrow_back_ios_new</span>
                </div>
                <div className="w-24 h-24 rounded-full bg-[#feb198] border-[2.5px] border-black flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="flex items-center gap-5 mt-2">
                    <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between w-16 px-1 mt-1">
                    <div className="w-3.5 h-2 bg-[#EE8070] rounded-full border border-black"></div>
                    <div className="w-3.5 h-2 bg-[#EE8070] rounded-full border border-black"></div>
                  </div>
                  <div className="w-6 h-3 border-b-[3px] border-black rounded-b-full mt-0.5"></div>
                </div>
              </div>
            </div>

            <div className="text-center space-y-1">
              <h1 className="text-[30px] font-black text-black tracking-tight">{t('onboarding.name.title')}</h1>
              <p className="text-[15px] text-[#56423f] max-w-xs mx-auto leading-relaxed">
                {t('onboarding.name.subtitle')}
              </p>
            </div>

            <div className="w-full space-y-4">
              <div className="flex flex-col gap-1 text-left">
                <label className="text-[13px] text-black pl-2 flex items-center gap-1.5" htmlFor="user-name-input">
                  <span className="material-symbols-outlined text-[15px]">badge</span>
                  {t('onboarding.name.label')}
                </label>
                <div className="relative w-full">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full bg-white text-black text-[20px] border-[2.5px] border-black rounded-full px-6 py-3.5 shadow-[4px_4px_0px_#000000] focus:outline-none focus:border-black focus:shadow-[4px_4px_0px_#000000] focus:ring-0 transition-all placeholder:text-black/40 placeholder:text-[17px] placeholder:italic ${nameError ? 'animate-shake' : ''}`}
                    id="user-name-input"
                    placeholder={t('onboarding.name.placeholder')}
                    type="text"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-black/40">
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="inline-flex items-center gap-1 bg-[#ffdbcf] border-[2.5px] border-black rounded-full px-4 py-1 shadow-[2px_2px_0px_#000000]">
                  <span className="material-symbols-outlined text-[15px] text-black" style={{ fontVariationSettings: 'FILL 1' }}>
                    lock
                  </span>
                  <span className="text-[11px] font-black text-black">{t('onboarding.name.privacy')}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-left space-y-4">
              <h1 className="text-[30px] font-black text-black mb-1 tracking-tight">{t('onboarding.lifeStage.title')}</h1>
              <p className="text-[15px] text-[#56423f] leading-snug">{t('onboarding.lifeStage.subtitle')}</p>
            </div>

            <div className="flex flex-col gap-4" role="radiogroup">
              {[
                { id: 'teen', label: 'onboarding.lifeStage.teen', desc: 'onboarding.lifeStage.teenDesc', age: 'onboarding.lifeStage.teenAge', icon: 'potted_plant', color: '#ffdbcf' },
                { id: 'adult', label: 'onboarding.lifeStage.adult', desc: 'onboarding.lifeStage.adultDesc', age: 'onboarding.lifeStage.adultAge', icon: 'favorite', color: '#EE8070' },
                { id: 'perimenopause', label: 'onboarding.lifeStage.perimenopause', desc: 'onboarding.lifeStage.perimenopauseDesc', age: 'onboarding.lifeStage.perimenopauseAge', icon: 'wb_twilight', color: '#feb198' }
              ].map((stage) => (
                <div
                  key={stage.id}
                  onClick={() => setLifeStage(stage.id)}
                  className={`group relative border-[2.5px] border-black rounded-3xl p-4 shadow-[4px_4px_0px_#000000] transition-all cursor-pointer hover:-translate-y-0.5 ${
                    lifeStage === stage.id ? 'bg-[#EE8070]' : ''
                  }`}
                  style={{ backgroundColor: lifeStage === stage.id ? '' : stage.color }}
                  role="radio"
                  aria-checked={lifeStage === stage.id}
                >
                  {lifeStage === stage.id && (
                    <div className="absolute -top-3 -right-2 bg-black text-white w-8 h-8 rounded-full border-[2.5px] border-black flex items-center justify-center shadow-[2px_2px_0px_#000000] z-10">
                      <span className="material-symbols-outlined text-[20px] font-black">check</span>
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white border-[2.5px] border-black shadow-[2px_2px_0px_#000000] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[30px]" style={{ fontVariationSettings: 'FILL 1' }}>
                        {stage.icon}
                      </span>
                    </div>
                    <div className="flex-1 pr-2">
                      <div className="flex items-baseline justify-between mb-0.5">
                        <span className="text-[20px] text-black font-extrabold">{t(stage.label)}</span>
                        <span className="text-[13px] text-black font-extrabold bg-white px-2 py-0.5 rounded-full border-[1.5px] border-black">
                          {t(stage.age)}
                        </span>
                      </div>
                      <p className="text-[13px] text-black leading-snug">{t(stage.desc)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </main>

      <footer className="w-full pb-2 pt-1">
        <button
          onClick={handleContinue}
          disabled={isLoading}
          className="w-full bg-[#EE8070] text-black font-black rounded-full border-[2.5px] border-black py-4 px-6 shadow-[4px_4px_0px_#000000] flex items-center justify-center gap-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="material-symbols-outlined animate-spin">refresh</span>
          ) : (
            <>
              <span>{step === 2 ? t('onboarding.lifeStage.finish') : t('onboarding.name.continue')}</span>
              <span className="material-symbols-outlined font-black text-[20px]">arrow_forward</span>
            </>
          )}
        </button>
      </footer>
    </div>
  );
}
