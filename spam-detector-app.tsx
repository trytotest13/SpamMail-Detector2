import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle, Send } from 'lucide-react';

const EmailSpamDetector = () => {
  const [activeTab, setActiveTab] = useState('single');
  const [emailText, setEmailText] = useState('');
  const [multipleEmails, setMultipleEmails] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modelTrained, setModelTrained] = useState(false);

  // Simulated training process
  useEffect(() => {
    const trainModel = async () => {
      setModelTrained(false);
      // Simulate training delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setModelTrained(true);
    };
    
    trainModel();
  }, []);

  // Simulated spam detection algorithm
  const detectSpam = (text) => {
    // Simple keyword-based detection for demonstration
    const spamKeywords = [
      'congratulations', 'won', 'free', 'viagra', 'discount', 'offer', 'rich', 'money',
      'limited time', 'act now', '90%', 'guaranteed', 'claim'
    ];
    
    text = text.toLowerCase();
    const matches = spamKeywords.filter(keyword => text.includes(keyword.toLowerCase()));
    const probability = Math.min(0.1 + (matches.length * 0.15), 0.99);
    
    return {
      isSpam: probability > 0.5,
      probability: probability,
      matchedPatterns: matches
    };
  };

  const analyzeSingleEmail = () => {
    if (!emailText.trim()) return;
    
    setIsLoading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const result = detectSpam(emailText);
      setResults([{
        id: Date.now(),
        text: emailText,
        result: result
      }]);
      setIsLoading(false);
    }, 800);
  };
  
  const analyzeMultipleEmails = () => {
    if (!multipleEmails.trim()) return;
    
    setIsLoading(true);
    const emails = multipleEmails.split('\n').filter(email => email.trim());
    
    // Simulate processing delay
    setTimeout(() => {
      const newResults = emails.map(email => ({
        id: Date.now() + Math.random() * 1000,
        text: email,
        result: detectSpam(email)
      }));
      
      setResults(newResults);
      setIsLoading(false);
    }, 1200);
  };

  const clearResults = () => {
    setResults([]);
  };

  const ResultCard = ({ result }) => {
    const { text, result: analysis } = result;
    const displayText = text.length > 100 ? text.substring(0, 100) + '...' : text;
    
    return (
      <div className={`mb-4 p-4 rounded-lg shadow-md border-l-4 ${analysis.isSpam ? 'border-l-red-500 bg-red-50' : 'border-l-green-500 bg-green-50'}`}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="font-mono text-sm text-gray-700 break-words">{displayText}</p>
            <div className="mt-3 flex items-center">
              {analysis.isSpam ? (
                <AlertCircle className="text-red-500 mr-2" size={20} />
              ) : (
                <CheckCircle className="text-green-500 mr-2" size={20} />
              )}
              <span className={`font-semibold ${analysis.isSpam ? 'text-red-700' : 'text-green-700'}`}>
                {analysis.isSpam ? 'SPAM' : 'NOT SPAM'}
              </span>
              <div className="ml-4 bg-gray-200 rounded-full h-2 w-32">
                <div 
                  className={`h-2 rounded-full ${analysis.isSpam ? 'bg-red-500' : 'bg-green-500'}`} 
                  style={{ width: `${analysis.probability * 100}%` }}
                />
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {(analysis.probability * 100).toFixed(0)}%
              </span>
            </div>
            
            {analysis.matchedPatterns.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-500">Suspicious patterns:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {analysis.matchedPatterns.map((pattern, i) => (
                    <span key={i} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                      {pattern}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Email Spam Detector</h1>
        <p className="text-gray-600">Analyze your emails for potential spam content</p>
      </div>
      
      {/* Training indicator */}
      {!modelTrained && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg flex items-center">
          <div className="w-4 h-4 mr-3 rounded-full bg-blue-500 animate-pulse"></div>
          <p className="text-blue-700">Training spam detection model...</p>
        </div>
      )}
      
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'single' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('single')}
        >
          Single Email
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'multiple' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('multiple')}
        >
          Multiple Emails
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'patterns' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('patterns')}
        >
          Spam Patterns
        </button>
      </div>
      
      {/* Single Email Tab */}
      {activeTab === 'single' && (
        <div>
          <textarea
            className="w-full h-32 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email text here..."
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
          />
          <div className="mt-4 flex space-x-3">
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700 transition disabled:opacity-50"
              onClick={analyzeSingleEmail}
              disabled={!modelTrained || isLoading || !emailText.trim()}
            >
              <Send size={16} className="mr-2" />
              Analyze Email
            </button>
            <button 
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              onClick={() => setEmailText('')}
            >
              Clear
            </button>
          </div>
        </div>
      )}
      
      {/* Multiple Emails Tab */}
      {activeTab === 'multiple' && (
        <div>
          <textarea
            className="w-full h-40 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter multiple emails, one per line..."
            value={multipleEmails}
            onChange={(e) => setMultipleEmails(e.target.value)}
          />
          <div className="mt-4 flex space-x-3">
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700 transition disabled:opacity-50"
              onClick={analyzeMultipleEmails}
              disabled={!modelTrained || isLoading || !multipleEmails.trim()}
            >
              <Send size={16} className="mr-2" />
              Analyze All Emails
            </button>
            <button 
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              onClick={() => setMultipleEmails('')}
            >
              Clear
            </button>
          </div>
        </div>
      )}
      
      {/* Spam Patterns Tab */}
      {activeTab === 'patterns' && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-lg mb-4 flex items-center">
            <Info size={18} className="text-blue-500 mr-2" />
            Common Spam Patterns to Watch For
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <AlertTriangle size={16} className="text-amber-500 mr-2 mt-1" />
              <span>Excessive use of capital letters or exclamation marks</span>
            </li>
            <li className="flex items-start">
              <AlertTriangle size={16} className="text-amber-500 mr-2 mt-1" />
              <span>Urgency words (Act now, Limited time, Expires soon)</span>
            </li>
            <li className="flex items-start">
              <AlertTriangle size={16} className="text-amber-500 mr-2 mt-1" />
              <span>Money-related promises (Free money, Cash prize, Get rich)</span>
            </li>
            <li className="flex items-start">
              <AlertTriangle size={16} className="text-amber-500 mr-2 mt-1" />
              <span>Requests for personal information or financial details</span>
            </li>
            <li className="flex items-start">
              <AlertTriangle size={16} className="text-amber-500 mr-2 mt-1" />
              <span>Suspicious links, attachments, or requests to download files</span>
            </li>
          </ul>
        </div>
      )}
      
      {/* Results Section */}
      {results.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-lg">Analysis Results</h3>
            <button 
              className="flex items-center text-sm text-gray-500 hover:text-gray-700"
              onClick={clearResults}
            >
              <X size={14} className="mr-1" /> Clear Results
            </button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div>
              {results.map(result => (
                <ResultCard key={result.id} result={result} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmailSpamDetector;
