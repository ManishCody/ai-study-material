import { headers } from 'next/headers';
import dbConnect from '@/configs/db';
import StudyMaterial from '@/models/StudyMaterial';
import { NextResponse } from 'next/server';

export async function PATCH(req) {
  console.log("API Route Hit");

  try {
    await dbConnect();
    console.log("Database connected");

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const {
      Complete,
      isComplete,
      chapter_id,
      isNotes = false,
      isFlashcard = false,
      isQuiz = false,
      isQuestion = false
    } = await req.json();

    console.log(Complete,
      isComplete,
      chapter_id,
      isNotes,
      isFlashcard,
      isQuiz,
      isQuestion);


    if (Complete !== undefined && (Complete < 0 || Complete > 100)) {
      return NextResponse.json({ error: 'Complete must be between 0 and 100' }, { status: 400 });
    }

    let updateFields = { Complete }; // Base update

    // Determine which section to mark as complete
    if (isNotes) updateFields.notes = true;
    if (isFlashcard) updateFields["flashcards.isComplete"] = true;
    if (isQuiz) updateFields["quizs.isComplete"] = true;
    if (isQuestion) updateFields["questions.isComplete"] = true;

    let updatedStudyMaterial;

    if (isFlashcard || isQuiz || isQuestion) {
      updatedStudyMaterial = await StudyMaterial.findOneAndUpdate(
        { _id: id },
        { $set: { ...updateFields } },
        { new: true, runValidators: false }
      );
    } else {
      updatedStudyMaterial = await StudyMaterial.findOneAndUpdate(
        { _id: id, "courseLayout.chapters._id": chapter_id },
        { $set: { Complete, "courseLayout.chapters.$.isComplete": isComplete } },
        { new: true, runValidators: false }
      );
    }

    if (!updatedStudyMaterial) {
      return NextResponse.json({ error: "Study material not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: 'Progress updated successfully', data: updatedStudyMaterial },
      { status: 200 }
    );
  } catch (error) {
    console.log('Error updating progress:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
