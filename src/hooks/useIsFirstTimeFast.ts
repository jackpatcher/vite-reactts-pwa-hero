import { useEffect, useState } from "react";
import { db } from "../modules/storage/indexedDb";

/**
 * Fast, one-time check for first time setup (no live reactivity)
 * Returns: undefined (loading), true (show setup), false (show app)
 */
export function useIsFirstTimeFast(): boolean | undefined {
  const [isFirstTime, setIsFirstTime] = useState<undefined | boolean>(undefined);

  useEffect(() => {
    db.table("config").get("firstTimeSetup").then((setup) => {
      setIsFirstTime(!setup?.value?.isFirstTimeSetupDone);
    });
  }, []);

  return isFirstTime;
}
