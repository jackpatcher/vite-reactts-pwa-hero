import { useState } from "react";
import { Button, Card, CardBody, Chip, Progress, Form } from "@heroui/react";
import FloatLabelInput from "../../components/FloatLabelInput";
import OtpInput from "../../components/OtpInput";
import { useNavigate } from "react-router-dom";
import { completeFirstTimeSetup } from "../../lib/appStorage";

const steps = [
  {
    title: "ข้อตกลงการใช้งาน",
    description: "โปรดอ่านข้อตกลงการใช้งานและกฎหมายให้ครบถ้วนก่อนใช้งานระบบนี้",
    badge: "step 1",
  },
  {
    title: "ข้อมูลโรงเรียน",
    description: "กรุณากรอก SchoolID และ SchoolPass (รหัส 6 ตัว)",
    badge: "step 2",
  },
  {
    title: "ข้อมูลผู้ใช้",
    description: "กรุณากรอก Username และ Password เพื่อยืนยันตัวตน",
    badge: "step 3",
  },
  {
    title: "ยินดีต้อนรับ",
    description: "ตั้งค่าเสร็จสมบูรณ์ พร้อมใช้งานระบบ Ambridge",
    badge: "step 4",
  },
];



export default function FirstimeSetupFlow() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [schoolID, setSchoolID] = useState("");
  const [schoolPass, setSchoolPass] = useState<string[]>(Array(6).fill(""));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");

  const totalSteps = steps.length;
  const isLast = activeStep === totalSteps - 1;
  const percent = Math.round(((activeStep + 1) / totalSteps) * 100);

  const handleNext = async () => {
    setError("");
    if (activeStep === 0 && !accepted) {
      setError("กรุณายอมรับข้อตกลงก่อน");
      return;
    }
    if (activeStep === 1) {
      if (!schoolID) {
        setError("กรุณากรอก SchoolID");
        return;
      }
      if (!/^[0-9]+$/.test(schoolID)) {
        setError("SchoolID ต้องเป็นตัวเลขเท่านั้น");
        return;
      }
      if (schoolPass.some(d => d === "")) {
        setError("กรุณากรอก SchoolPass ให้ครบ 6 ตัวอักษร/ตัวเลข");
        return;
      }
      if (!schoolPass.every(d => /^[A-Za-z0-9]$/.test(d))) {
        setError("SchoolPass ต้องเป็นตัวอักษรหรือตัวเลข 6 ตัว");
        return;
      }
    }
    if (activeStep === 2) {
      if (!username || !password) {
        setError("กรุณากรอก Username และ Password");
        return;
      }
    }
    // If we're on the user info step (index 2), persist the collected data
    if (activeStep === 2) {
      await completeFirstTimeSetup({
        SchoolID: schoolID,
        SchoolPass: schoolPass.join("").toUpperCase(),
        Username: username,
        Password: password,
        isFirstTimeSetupDone: true,
      });
    }

    const newActive = activeStep + 1;
    setActiveStep(newActive);
    if (newActive === 3) {
      navigate("/dashboard/overview", { replace: true });
    }
  };

  const handleBack = () => {
    setError("");
    setActiveStep((prev) => Math.max(0, prev - 1));
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
              Step {activeStep + 1} of {totalSteps}
            </span>
            <span>{percent}%</span>
          </div>
        </div>
        <div>
          {activeStep === 0 && (
            <Card className="firstTImeSetup-card" shadow="sm" isBlurred>
              <CardBody>
                <h2>ข้อตกลงการใช้งาน</h2>
                <p>โปรดอ่านข้อตกลงการใช้งานและกฎหมายให้ครบถ้วนก่อนใช้งานระบบนี้</p>
                <div className="mt-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} />
                    <span>ฉันยอมรับข้อตกลง</span>
                  </label>
                </div>
              </CardBody>
            </Card>
          )}
          {activeStep === 1 && (
            <Card className="firstTImeSetup-card" shadow="sm" isBlurred>
              <CardBody>
                <h2>ข้อมูลโรงเรียน</h2>
                <p>กรุณากรอก SchoolID และ SchoolPass</p>
                <Form
                  className="w-full max-w-md mt-4 flex flex-col gap-4"
                  validationBehavior="aria"
                  onSubmit={e => {
                    e.preventDefault();
                    handleNext();
                  }}
                >
                  <FloatLabelInput
                    name="schoolID"
                    label="SchoolID"
                    type="text"
                    value={schoolID}
                    onChange={val => setSchoolID(val)}
                    required
                  />
                  <div className="flex flex-col gap-2">
                    <label className="font-medium text-sm mb-1">SchoolPass (รหัส 6 ตัว)</label>
                    <div id="otp-input" className="flex justify-center">
                      <OtpInput
                        length={6}
                        value={schoolPass.join("")}
                        onChange={val => {
                          const arr = val.replace(/[^A-Za-z0-9]/g, "").slice(0,6).split("");
                          while (arr.length < 6) arr.push("");
                          setSchoolPass(arr);
                        }}
                      />
                    </div>
                  </div>
                </Form>
              </CardBody>
            </Card>
          )}
          {activeStep === 2 && (
            <Card className="firstTImeSetup-card" shadow="sm" isBlurred>
              <CardBody>
                <h2>ข้อมูลผู้ใช้</h2>
                <p>กรุณากรอก Username และ Password เพื่อยืนยันตัวตน</p>
                <div className="mt-4 flex flex-col gap-2 items-center">
                  <FloatLabelInput
                    name="username"
                    label="Username"
                    type="text"
                    value={username}
                    onChange={val => setUsername(val)}
                    required
                    className="w-full max-w-sm mx-auto"
                  />
                  <FloatLabelInput
                    name="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={val => setPassword(val)}
                    required
                    className="w-full max-w-sm mx-auto"
                  />
                </div>
              </CardBody>
            </Card>
          )}
          {activeStep === 3 && (
            <Card className="firstTImeSetup-card" shadow="sm" isBlurred>
              <CardBody>
                <h2>ยินดีต้อนรับ</h2>
                <p>ตั้งค่าเสร็จสมบูรณ์ พร้อมใช้งานระบบ Ambridge</p>
              </CardBody>
            </Card>
          )}
          {error && <div className="text-red-500 mt-2 text-sm font-semibold">{error}</div>}
        </div>
        <div className="firstTImeSetup-actions">
          <>
            <Button
              variant="light"
              onPress={handleBack}
              isDisabled={activeStep === 0}
            >
              Back
            </Button>
            <Button
              style={{
                background: isLast ? "var(--theme-primary, #2563eb)" : undefined,
                color: isLast ? "#fff" : undefined,
                fontWeight: 700,
                fontSize: 16,
                boxShadow: isLast ? "0 2px 8px rgba(0,0,0,0.10)" : undefined,
              }}
              color={isLast ? undefined : "primary"}
              onPress={handleNext}
            >
              {isLast ? "Finish setup" : "Next"}
            </Button>
          </>
        </div>
        <div className="firstTImeSetup-hint">กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง</div>
      </div>
    </div>
  );
}
