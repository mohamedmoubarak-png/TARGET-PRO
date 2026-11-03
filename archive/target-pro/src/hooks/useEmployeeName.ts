import { useState, useEffect } from "react";

export function useEmployeeInfo() {
  const [name, setName] = useState<string | null>(null);
  const [jobTitle, setJobTitle] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("tp:employee");
    if (storedName) {
      try { setName(JSON.parse(storedName)); } catch { /* ignore */ }
    }
    const storedJob = localStorage.getItem("tp:jobtitle");
    if (storedJob) {
      try { setJobTitle(JSON.parse(storedJob)); } catch { /* ignore */ }
    }
    setIsLoaded(true);
  }, []);

  const saveInfo = (newName: string, newJobTitle: string) => {
    localStorage.setItem("tp:employee", JSON.stringify(newName));
    localStorage.setItem("tp:jobtitle", JSON.stringify(newJobTitle));
    setName(newName);
    setJobTitle(newJobTitle);
  };

  return { name, jobTitle, saveInfo, isLoaded };
}
