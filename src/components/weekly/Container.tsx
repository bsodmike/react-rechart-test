import React from "react";
import styled from "styled-components";
import { WeeklyChart } from "./WeeklyChart";
import { Tasks } from "../../data/tasks";

interface ContainerProps {
  tasks_response: Tasks;
  view_filename: string;
}

// Styled component for the container
const TextContainer = styled.div`
  text-align: left;
  width: 100%;
  padding: 2em;
`;
const ChartContainer = styled.div`
  width: 500px;
  height: 800px;
`;

export const Container: React.FC<ContainerProps> = ({ view_filename, tasks_response }) => (
  <TextContainer className="flex-grow max-w auto-cols-max">
    <h1 className="text-2xl font-extrabold">Template: {view_filename}</h1>

    <ChartContainer>
      <WeeklyChart tasks_response={tasks_response}></WeeklyChart>
    </ChartContainer>
  </TextContainer>
);
