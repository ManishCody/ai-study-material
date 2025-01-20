import React, { useState } from "react";
import { motion } from "framer-motion";

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };

  const topicVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="mt-8 px-4 md:px-8 lg:px-16 space-y-8">
      {courseLayout?.chapters?.map((chapter, chapterIndex) => (
        <motion.div
          key={chapterIndex}
          className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          custom={chapterIndex}
        >
          {/* Chapter Title */}
          <div
            className={`cursor-pointer flex items-center justify-between px-4 md:px-6 py-4 ${
              openChapterIndex === chapterIndex
                ? "bg-gradient-to-r from-purple-500 to-blue-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            } rounded-t-lg transition-all duration-300`}
            onClick={() => handleToggleChapter(chapterIndex)}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  openChapterIndex === chapterIndex
                    ? "bg-white text-purple-600"
                    : "bg-blue-500 text-white"
                } transition-all duration-300`}
              >
                <b className="fas fa-book font-sans text-lg">
                  {chapterIndex + 1}
                </b>
              </div>
              <h2 className="text-sm md:text-lg font-semibold break-words leading-5">
                {decodeHtml(chapter.chapterTitle)}
              </h2>
            </div>
            <span
              className={`text-lg transform transition-transform duration-500 ${
                openChapterIndex === chapterIndex ? "rotate-180" : ""
              }`}
            >
              <i className="fas fa-chevron-down"></i>
            </span>
          </div>

          {/* Collapsible Topics */}
          <motion.div
            key={openChapterIndex === chapterIndex ? `open-${chapterIndex}` : `close-${chapterIndex}`}
            initial="hidden"
            animate={openChapterIndex === chapterIndex ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0, height: 0 },
              visible: { opacity: 1, height: "auto", transition: { duration: 0.5 } },
            }}
            className="overflow-hidden"
          >
            <div className="bg-gray-50 px-4 md:px-6 py-4 space-y-4">
              {chapter.topics.map((topic, topicIndex) => (
                <motion.div
                  key={topicIndex}
                  className="flex items-start bg-gradient-to-r from-indigo-50 to-indigo-100 border-l-4 border-blue-500 p-3 rounded-md shadow-sm hover:shadow-md hover:scale-[1.02] transform transition-all duration-300"
                  variants={topicVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="flex items-center justify-start sm:justify-center gap-4">
                    <div className=" w-5 h-5 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
                      {topicIndex + 1}
                    </div>
                    <button className="text-sm md:text-base text-blue-700 font-medium hover:underline focus:outline-none break-words text-left">
                      {decodeHtml(topic.title)}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default CourseIndex;
