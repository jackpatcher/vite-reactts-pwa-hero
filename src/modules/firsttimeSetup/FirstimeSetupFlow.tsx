import { useState } from "react";
import { Button, Card, CardBody, Chip, Progress, Form, Input } from "@heroui/react";
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
    description: "กรุณากรอก SchoolID และ SchoolPass (เลข 6 หลัก)",
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
  const [schoolPass, setSchoolPass] = useState("");
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
      if (!schoolPass) {
        setError("กรุณากรอก SchoolPass");
        return;
      }
      if (!/^[0-9]+$/.test(schoolPass)) {
        setError("SchoolPass ต้องเป็นตัวเลขเท่านั้น");
        return;
      }
    }
    if (activeStep === 2) {
      if (!username || !password) {
        setError("กรุณากรอก Username และ Password");
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
    if (activeStep === 2) {
      await completeFirstTimeSetup();
    }
    if (activeStep === 3) {
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
                  <Input
                    isRequired
                    label="SchoolID"
                    labelPlacement="outside"
                    name="schoolID"
                    placeholder="กรอกเลขรหัสโรงเรียน (ตัวเลขเท่านั้น)"
                    type="text"
                    value={schoolID}
                    onValueChange={setSchoolID}
                    validate={value => {
                      if (!value) return "กรุณากรอก SchoolID";
                      if (!/^[0-9]+$/.test(value)) return "SchoolID ต้องเป็นตัวเลขเท่านั้น";
                      return null;
                    }}
                  />
                  <Input
                    isRequired
                    label="SchoolPass"
                    labelPlacement="outside"
                    name="schoolPass"
                    placeholder="กรอกรหัสผ่านโรงเรียน (ตัวเลขเท่านั้น)"
                    type="text"
                    value={schoolPass}
                    onValueChange={setSchoolPass}
                    validate={value => {
                      if (!value) return "กรุณากรอก SchoolPass";
                      if (!/^[0-9]+$/.test(value)) return "SchoolPass ต้องเป็นตัวเลขเท่านั้น";
                      return null;
                    }}
                  />
                  
                </Form>
              </CardBody>
            </Card>
          )}
          {activeStep === 2 && (
            <Card className="firstTImeSetup-card" shadow="sm" isBlurred>
              <CardBody>
                <h2>ข้อมูลผู้ใช้</h2>
                <p>กรุณากรอก Username และ Password เพื่อยืนยันตัวตน</p>
                <div className="mt-4 flex flex-col gap-2">
                  <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="input" />
                  <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="input" />
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
