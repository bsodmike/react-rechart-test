import React, { useMemo, useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from "recharts";
import { Tasks } from "../../data/tasks";
import { format, parseISO } from "date-fns";
import _ from "lodash";

interface ComponentProps {
  tasks_response: Tasks;
}

export const WeeklyChart: React.FC<ComponentProps> = ({ tasks_response }) => {
  // const [chartData, setChartData] = useState([]) 
  const [barEntries, setBarEntries] = useState([]);

  useEffect(() => {
    let ignore = false;

    return () => {
      ignore = true;
    };
  }, []);

  const chartData = useMemo(() => {
    const tasks_collection = tasks_response?.tasks.slice(0, 20);
    const processed = [];
    const barComponentItems = [];

    console.log(tasks_response);

    tasks_collection?.forEach((el, index) => {
      let color = "#ab3";
      if (index % 2 != 0) {
        color = "#000";
      }

      barComponentItems.push({
        name: el.name,
        hours_completed_self: el.hours_completed_self,
        accounting_type: el.accounting_type,
        color: color,
      });
    });
    setBarEntries(barComponentItems);
    console.log("Bar items: %O", barComponentItems);

    interface mappedTask {
      name: string,
      hours_completed_self: number,
      accounting_type: string,
    }
    const mapEntries = (value: [string, mappedTask[]]) => {
      return {
              date: value[0],
            ...Object.fromEntries(value[1].map((task) => [task.name, task.hours_completed_self])),
      }
    };

    // FIXME: need to figure out duration
    let data = Object.entries(_.groupBy(tasks_collection, (task) => format(parseISO(task.due_on), "yyyy-MM-dd")))
    .map(mapEntries);

    console.log(data);
    return data;
  }, [tasks_response]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        {barEntries.map((task, index) => (
          // key prop below is just to satisfy React
          <Bar key={task.name} dataKey={task.name} fill={task.color} stackId={setStackId(task)} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

// TODO code organisation needs improving; these are being left here just for this quick POC
const setColor = (task, index) => {
  if ((setStackId(task) ?? "other") === "assigned") {
    return getRandomColor();
  } else {
    let color = "#dcdcdc";
    if (index % 2 != 0) {
      color = "#eee";
    }

    return color;
  }
};

const setStackId = (task) => {
  if ((task.accounting_type ?? "other") === "other" || null) {
    // FIXME change to "assigned" to see colors in chart
    return "other";
  } else {
    return "assigned";
  }
};

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}
