import React, { useState, useEffect } from 'react';

function EntryPage() {
  const [khataName, setKhataName] = useState('');
  const [khataList, setKhataList] = useState([]);
  const [selectedKhata, setSelectedKhata] = useState('');
  const [showAddKhata, setShowAddKhata] = useState(false);

  useEffect(() => {
    fetchKhatas();
  }, []);

  const fetchKhatas = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/khatas');
      const data = await response.json();
      setKhataList(data);
    } catch (error) {
      console.error('Error fetching khatas:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (khataName.trim() !== '') {
      try {
        const response = await fetch('http://localhost:3001/api/khatas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: khataName }),
        });
        const data = await response.json();
        setKhataList([...khataList, data]);
        setKhataName('');
        setShowAddKhata(false);
      } catch (error) {
        console.error('Error adding khata:', error);
      }
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Left side: Add Khata / Enter Khata */}
        <div className="w-full sm:w-1/2">
          {!showAddKhata ? (
            <button 
              onClick={() => setShowAddKhata(true)}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Add Khata
            </button>
          ) : (
            <div>
              <label htmlFor="khataName" className="block text-sm font-medium text-gray-700 mb-1">
                Enter Khata
              </label>
              <form onSubmit={handleSubmit} className="relative">
                <input
                  id="khataName"
                  type="text"
                  value={khataName}
                  onChange={(e) => setKhataName(e.target.value)}
                  placeholder="Enter Khata Name"
                  className="w-full pl-3 pr-24 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  type="submit" 
                  className="absolute right-1 top-1 bottom-1 bg-blue-500 text-white px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Submit
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right side: Select Khata */}
        <div className="w-full sm:w-1/2">
          <label htmlFor="selectKhata" className="block text-sm font-medium text-gray-700 mb-1">
            Select Khata
          </label>
          <select
            id="selectKhata"
            value={selectedKhata}
            onChange={(e) => setSelectedKhata(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Khata</option>
            {khataList.map((khata) => (
              <option key={khata.id} value={khata.id}>
                {khata.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default EntryPage;