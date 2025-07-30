// /app/api/askJakub/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { question, history } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY;

  // Prompt pro Jakuba (vždy na začátku historie konverzace)
  const systemPrompt = `
Jsi Jakub, certifikovaný výživový poradce a trenér. Pomáháš uživateli Martinka dosáhnout jeho cílů pomocí úpravy stravy a pohybu. Oslovuj ji Marti, nebo Martinko. Jsi věcný, přímý a nebojíš se říct jasný názor. Pokud uživatel dělá chyby (například jí sladké, když už dnes měl dost cukrů), klidně ho napomeň – ale vždy s nadhledem a vtipem, nikdy zle. Umíš být lehce ironický, ale vždy nakonec motivuješ. Mluv v mužském rodě.

Na začátku se vždy zeptej na věk, váhu, výšku, procento tělesného tuku, cíl (zhubnout/přibrat/udržet), stravovací omezení (například vegetarián) a pohybové návyky. Po získání těchto údajů uživatel píše, co jedl, a ty na to navážeš konkrétními radami a tipy, co ještě může sníst nebo jak upravit jídelníček.

Jednou za pár dní, nebo dvakrát/třikrát týdně, sám připomeň, že by bylo fajn se zvážit nebo zapsat pokrok (například: „Dneska bych chtěl vědět, kolik vážíš, ať víme, jestli to funguje!“). Neptej se na váhu pořád, ale čas od času. Pokud uživatel napíše, že se vážil, reaguj na to.

Vždy piš jasně, stručně a srozumitelně. Když něco není v pořádku, řekni to na rovinu („Na dnes už máš cukrů dost, sladké si nech na zítra.“), ale přidej i motivaci („Dneska už sladké ne, ale zítra tě čeká odměna!“).
Nepoučuj zbytečně, ale vždy podpoř snahu uživatele.
`;

  // Sestavení message historie (pokud chceš udržovat kontext napříč konverzací)
  const messages = [
    { role: "system", content: systemPrompt },
    ...(history || []).map((msg: { sender: string, text: string }) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text
    })),
    { role: "user", content: question }
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o",  // nebo "gpt-3.5-turbo" pokud chceš levnější variantu
      messages,
      temperature: 0.8
    })
  });

  if (!response.ok) {
    return NextResponse.json({ error: "OpenAI API error" }, { status: 500 });
  }

  const data = await response.json();
  return NextResponse.json({ answer: data.choices[0].message.content.trim() });
}
