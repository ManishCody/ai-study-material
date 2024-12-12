import React from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TopicInput = ({ topic, difficulty, onTopicChange, onDifficultyChange }) => {
  return (
    <div className="p-6 mx-auto space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Enter topic or paste the content for which you want to generate study material
        </h2>
        <Textarea
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
          placeholder="Start writing here..."
          className="w-full border-gray-300 focus:ring-2 focus:ring-blue-400 rounded-lg"
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Select the difficulty level
        </h2>
        <Select value={difficulty} onValueChange={onDifficultyChange}>
          <SelectTrigger className="w-full border-gray-300 focus:ring-2 focus:ring-blue-400 rounded-lg">
            <SelectValue placeholder="Difficulty level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Moderate">Moderate</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TopicInput;
