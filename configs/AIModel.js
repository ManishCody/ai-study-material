import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
  
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  

    export const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "Generate study material for Python for an exam. The difficulty level should be Easy. The study material should include:\n\nA course summary.\nA list of chapters, each with:\nA chapter summary.\nA list of topics within the chapter.\nThe output should be in JSON format."},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n{\n  \"course_summary\": \"This course provides a basic introduction to Python programming.  It covers fundamental concepts such as data types, operators, control flow, functions, and basic data structures.  Upon completion, students will be able to write simple Python programs to solve basic problems.\",\n  \"chapters\": [\n    {\n      \"chapter_title\": \"Introduction to Python\",\n      \"chapter_summary\": \"This chapter introduces the Python programming language, its features, and how to set up your development environment. It covers basic syntax and running your first Python program.\",\n      \"topics\": [\n        \"What is Python?\",\n        \"Setting up Python (installation and IDE)\",\n        \"Basic Syntax (indentation, comments)\",\n        \"Running your first Python program\",\n        \"Printing to the console\"\n      ]\n    },\n    {\n      \"chapter_title\": \"Data Types and Operators\",\n      \"chapter_summary\": \"This chapter covers fundamental data types in Python, including integers, floats, strings, and booleans, and how to use operators to manipulate them.\",\n      \"topics\": [\n        \"Integers and Floats\",\n        \"Strings and String Manipulation (concatenation, slicing)\",\n        \"Booleans and Boolean Operators (and, or, not)\",\n        \"Arithmetic Operators (+, -, *, /, //, %, **)\",\n        \"Comparison Operators (==, !=, >, <, >=, <=)\",\n        \"Assignment Operators (=, +=, -=, *=, /=)\",\n        \"Type Conversion\"\n      ]\n    },\n    {\n      \"chapter_title\": \"Control Flow\",\n      \"chapter_summary\": \"This chapter explains how to control the flow of execution in your programs using conditional statements and loops.\",\n      \"topics\": [\n        \"if, elif, else statements\",\n        \"for loops (iterating through sequences)\",\n        \"while loops (repeating until a condition is met)\",\n        \"break and continue statements\"\n      ]\n    },\n    {\n      \"chapter_title\": \"Functions\",\n      \""},
          ],
        },
      ],
    });
  
    // const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
    // console.log(result.response.text());
