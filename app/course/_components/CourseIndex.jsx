import React, { useState } from 'react';

const CourseIndex = ({ courseLayout }) => {
  const [openChapterIndex, setOpenChapterIndex] = useState(null);

  const handleToggleChapter = (index) => {
    setOpenChapterIndex(openChapterIndex === index ? null : index);
  };

  const decodeHtml = (html) => {
    const text = document.createElement("textarea");
    text.innerHTML = html;
    return text.value;
  };

  return (
    <div className="mt-6 space-y-6">
      {courseLayout?.chapters?.map((chapter, chapterIndex) => (
        <div key={chapterIndex} className="border-b pb-2">
          {/* Chapter Title */}
          <div
            className="cursor-pointer bg-blue-600 text-white p-4 rounded-lg shadow-md h-10 flex justify-between items-center"
            onClick={() => handleToggleChapter(chapterIndex)}
          >
            <h2 className="text-sm font-semibold">{decodeHtml(chapter.chapterTitle)}</h2>
            <span className={`transform transition-transform ${openChapterIndex === chapterIndex ? 'rotate-180' : ''}`}>
              <i className="fas fa-chevron-down"></i>
            </span>
          </div>

          {/* Collapsible Topics */}
          {openChapterIndex === chapterIndex && (
            <div className="mt-2 flex flex-col space-y-2">
              {chapter.topics.map((topic, topicIndex) => (
                <div key={topicIndex} className="bg-gray-100 p-4 h-10 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-start">
                  <button className="text-sm text-blue-500 hover:underline">{decodeHtml(topic.title)}</button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CourseIndex;
