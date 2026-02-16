import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, CardBody, Chip, Progress } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { completeFirstTimeSetup } from "../../lib/appStorage";

const steps = [
  {
    title: "Welcome to Ambridge",
    description:
      "We will walk you through the core actions and help you set up your workspace.",
    badge: "Start",
  },
  {
    title: "Connect your tools",
    description:
      "Add your first apps, enable integrations, and pin the tools you use every day.",
    badge: "Step 1",
  },
  {
    title: "Invite your team",
    description:
      "Create roles and invite teammates so everyone can collaborate in one place.",
    badge: "Step 2",
  },
  {
    title: "Finish setup",
    description:
      "Review your preferences and confirm your registration details to go live.",
    badge: "Step 3",
  },
];



export default function FirstimeSetupFlow() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isScrollingRef = useRef(false);

  const totalSteps = steps.length;
  const isLast = activeIndex === totalSteps - 1;
  const percent = useMemo(
    () => Math.round(((activeIndex + 1) / totalSteps) * 100),
    [activeIndex, totalSteps]
  );

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    isScrollingRef.current = true;
    const width = container.clientWidth || 1;
    container.scrollTo({ left: width * activeIndex, behavior: "smooth" });
    const timer = setTimeout(() => {
      isScrollingRef.current = false;
    }, 500);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  const handleScroll = () => {
    if (isScrollingRef.current) return;
    const container = scrollRef.current;
    if (!container) return;
    const width = container.clientWidth || 1;
    const nextIndex = Math.round(container.scrollLeft / width);
    if (nextIndex !== activeIndex) {
      setActiveIndex(nextIndex);
    }
  };

  const handleFinish = async () => {
    await completeFirstTimeSetup();
    console.log("Finish setup clicked");
    navigate("/dashboard/overview", { replace: true });
  };

  return (
    <div className="firstTImeSetup">
      <div className="firstTImeSetup-shell">
        <div className="firstTImeSetup-header">
          <div className="firstTImeSetup-brand">
            <div className="brand-mark">HQ</div>
            <div>
              <div className="brand-title">Ambridge</div>
              <div className="brand-subtitle">PLATFORM SETUP</div>
            </div>
          </div>
          <Chip color="secondary" variant="flat">
            First time setup
          </Chip>
        </div>
        <div className="firstTImeSetup-progress">
          <Progress 
            value={percent} 
            color="primary" 
            className="firstTImeSetup-progress-bar" 
            aria-label={`Setup progress: ${percent}%`}
          />
          <div className="firstTImeSetup-progress-meta">
            <span>
              Step {activeIndex + 1} of {totalSteps}
            </span>
            <span>{percent}%</span>
          </div>
        </div>
        <div className="firstTImeSetup-carousel" ref={scrollRef} onScroll={handleScroll}>
          {steps.map((step) => (
            <div className="firstTImeSetup-slide" key={step.title}>
              <Card className="firstTImeSetup-card" shadow="sm" isBlurred>
                <CardBody>
                  <Chip color="primary" variant="flat" size="sm">
                    {step.badge}
                  </Chip>
                  <h2>{step.title}</h2>
                  <p>{step.description}</p>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
        <div className="firstTImeSetup-dots" role="tablist" aria-label="firstTImeSetup steps">
          {steps.map((step, index) => (
            <button
              key={step.title}
              type="button"
              className={`firstTImeSetup-dot${index === activeIndex ? " is-active" : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to step ${index + 1}`}
              aria-current={index === activeIndex ? "step" : undefined}
            />
          ))}
        </div>
        <div className="firstTImeSetup-actions">
          <Button
            variant="light"
            onPress={() => setActiveIndex((index) => Math.max(0, index - 1))}
            isDisabled={activeIndex === 0}
          >
            Back
          </Button>
          <Button color="primary" onPress={() => (isLast ? handleFinish() : setActiveIndex((prev) => prev + 1))}>
            {isLast ? "Finish setup" : "Next"}
          </Button>
        </div>
        <div className="firstTImeSetup-hint">Swipe to continue or use the buttons.</div>
      </div>
    </div>
  );
}
