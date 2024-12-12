import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    console.log("Event received:", event);
    await step.sleep("wait-a-moment", "1s");
    return { message: "Hello, World!", event };
  }
);

