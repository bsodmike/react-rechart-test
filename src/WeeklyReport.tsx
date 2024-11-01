// import { HelloWorld } from '@bhouston/react-lib';
import React, { useMemo, useState } from "react";
import { Container } from "./components/weekly/Container";
import { Convert, Tasks }  from "./data/tasks";
// import { NavBar, NavBarActive } from "./components/Navbar";

import { DummyTaskData } from "./data/mocked";

const WeeklyReport: React.FC = () => {
  const [serverMessage, setServerMessage] = useState<Tasks>();

  useMemo(() => {
    // fetch("/api/mocked/get-tasks").then(async (res) => {
    //   const json: Tasks = await res.json();

    //   return setServerMessage(json);
    // });
    
    const dummy = DummyTaskData as unknown
    const json: Tasks = dummy as Tasks;
    return setServerMessage(json);
  }, []);

  return (
    <div className="text-center mt-4">
      {/* <NavBar active={NavBarActive.WeeklyReport} /> */}
      <Container view_filename={"WeeklyReport.tsx"} tasks_response={serverMessage} />
    </div>
  );
};

export default WeeklyReport;
