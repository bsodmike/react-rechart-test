import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from './App';
import { NextUIProvider } from "@nextui-org/react";

import WeeklyReport from "./WeeklyReport.js";
import './index.css';

const rootNode = document.getElementById('root') as HTMLElement;
const root = createRoot(rootNode);
root.render(
    <React.StrictMode>
      <NextUIProvider>
        <main className="text-foreground bg-background">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<WeeklyReport />} />
            </Routes>
          </BrowserRouter>
        </main>
      </NextUIProvider>
    </React.StrictMode>
  );
