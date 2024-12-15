import { useState } from 'react'
import './App.css'
import { extractPageContent } from './content';
import OpenAI from 'openai';
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

const client = new OpenAI({
  apiKey: apiKey  , // This is the default and can be omitted
  dangerouslyAllowBrowser: true,
});
function App() {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const summarizeContent = async () => {
    try {
      setLoading(true);
      
      // Get current tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Execute content script to extract text
      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id as number},
        func: extractPageContent,
      });
      console.log("🚀 ~ summarizeContent ~ result:", result)

      // Get summary from OpenAI
      const completion = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "user",
          content: `Please summarize this text concisely: ${result}`
        }],
        max_tokens: 150
      });
      setSummary(completion.choices[0]?.message?.content ?? '');
    } catch (error) {
      console.error('Error:', error);
      setSummary('Error generating summary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md">
      <button
        onClick={summarizeContent}
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-300"
      >
        {loading ? 'Summarizing...' : 'Summarize Page'}
      </button>
      
      {summary && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <h2 className="font-bold mb-2">Summary:</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}

export default App
