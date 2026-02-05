import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type FileInfoItem = { name: string; size: number; type: string } | null;

export async function POST(req: Request) {
  try {
    const { fileInfo, jds } = await req.json() as {
      fileInfo?: { career: FileInfoItem; resume: FileInfoItem };
      jds?: string[];
    };

    const jdList = Array.isArray(jds) ? jds.filter(Boolean) : [];
    if (jdList.length === 0) {
      return NextResponse.json({ error: '求人票が1件以上必要です。' }, { status: 400 });
    }

    const career = fileInfo?.career ?? null;
    const resume = fileInfo?.resume ?? null;
    if (!career?.name && !resume?.name) {
      return NextResponse.json({ error: '職務経歴書または履歴書のファイル情報が必要です。' }, { status: 400 });
    }

    const fileSummary = [
      career && `職務経歴書: ${career.name} (${(career.size / 1024).toFixed(1)} KB)`,
      resume && `履歴書: ${resume.name} (${(resume.size / 1024).toFixed(1)} KB)`,
    ].filter(Boolean).join('\n');

    const jdBlock = jdList.map((text, i) => `【求人${i + 1}】\n${text}`).join('\n\n');

    const userContent = `アップロードされた書類（現時点ではファイル名・サイズのみ利用）:\n${fileSummary}\n\n---\n\n求人票（複数）:\n${jdBlock}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "あなたはプロの転職エージェントです。求人票(JD)に合わせて職務経歴書・履歴書を添削し、採用担当者の目に留まる内容にブラッシュアップしてください。複数求人がある場合は、各求人に共通してアピールできる点と、求人ごとの最適化のヒントを分けて示してください。",
        },
        { role: "user", content: userContent },
      ],
    });

    return NextResponse.json({ result: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '解析中にエラーが発生しました。' },
      { status: 500 }
    );
  }
}
