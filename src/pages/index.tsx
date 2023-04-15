import { Spinner } from "@components";
import { useState } from "react";
import { MDXProvider } from "@mdx-js/react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Inter } from "next/font/google";
import clsx from "clsx";
import { Plan } from "@/common/types/gpt";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [background, setBackground] = useState("");
  const [goal, setGoal] = useState("");
  const [interval, setInterval] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState({} as Plan);
  const handleSubmit = async () => {
    setLoading(true);
    const plan = await fetch("/api/gpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        background,
        goal,
        interval,
      }),
    }).then((res) => res.json());
    setPlan(plan);
    setLoading(false);
  };

  return (
    <main
      className={clsx(
        "h-screen flex flex-col space-y-5 space-x-5 items-center justify-center p-24 bg-white text-black",
        inter.className
      )}
    >
  
      <h1>
        <span className="text-4xl font-bold">GPT-3.5</span> Plan Generator Demo
      </h1>
      <div className="grid grid-cols-2 h-1/2  max-w-5xl gap-5 w-full">
        <form
          className="border flex flex-col justify-between p-5 rounded font-medium "
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="space-y-3">
            <div className="flex flex-col space-y-2">
              <label htmlFor="background" className="text-black">
                Background
              </label>
              <textarea
                required
                id="background"
                onChange={(e) => setBackground(e.target.value)}
                value={background}
                className="border rounded-md font-normal "
              ></textarea>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-black" htmlFor="goal">
                Goal
              </label>
              <textarea
                required
                id="goal"
                onChange={(e) => setGoal(e.target.value)}
                value={goal}
                className="border rounded-md font-normal"
              ></textarea>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-black" htmlFor="interval">
                Interval
              </label>
              <input
                required
                id="iterval"
                onChange={(e) => setInterval(e.target.value)}
                value={interval}
                className="border rounded-md h-10 font-normal"
              ></input>
            </div>
          </div>
          <button
            disabled={loading}
            className="bg-black text-white rounded-md mt-3 flex items-center justify-center p-4"
            type="submit"
          >
            {loading ? <Spinner className="text-white h-2 m-2" /> : "Submit"}
          </button>
        </form>

        <div className="border  h-full p-4 rounded flex flex-col overflow-hidden">
          <div className="flex justify-between">
            <h1 className="font-medium">Response</h1>
           
          </div>
          <div className="overflow-y-auto flex-1">
            <div className="flex flex-col space-y-3">
              <span className="font-medium">Goal:</span> {plan.goal && plan.goal}
              <span className="font-medium">Timeframe:</span> {plan.timeframe && plan.timeframe}
            </div>
            {plan.goal &&
              plan.plan.map((step, i) => (
                <div key={i} className="border p-4 rounded-md my-2">
                  <h1 className="font-medium">{step.step}</h1>
                  <ul className="">
                    {step.subtasks.map((task, i) => (
                      <li className="flex" key={i}>
                        <span className="mr-2">•</span>
                        <div className="flex flex-col">
                          <span>
                            {task.count} time{task.count > 1 ? "s" : ""}{" "}
                            {task.interval}
                          </span>
                          {task.task}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}
