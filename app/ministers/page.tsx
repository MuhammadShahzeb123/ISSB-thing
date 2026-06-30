'use client';

import { useState } from 'react';

interface Minister {
  name: string;
  portfolio: string;
  party: string;
  additional?: string;
}

const ministers: Minister[] = [
  { name: "Mian Muhammad Shehbaz Sharif", portfolio: "Prime Minister", party: "PML(N)" },
  { name: "Mr. Mohammad Ishaq Dar", portfolio: "Foreign Affairs", party: "PML(N)", additional: "Deputy Prime Minister" },
  { name: "Mr. Muhammad Aurangzeb", portfolio: "Finance & Revenue", party: "PML(N)" },
  { name: "Khawaja Muhammad Asif", portfolio: "Defence", party: "PML(N)" },
  { name: "Syed Mohsin Raza Naqvi", portfolio: "Interior & Narcotics Control", party: "Independent" },
  { name: "Mr. Attaullah Tarar", portfolio: "Information & Broadcasting", party: "PML(N)" },
  { name: "Mr. Azam Nazeer Tarar", portfolio: "Law & Justice", party: "PML(N)", additional: "Human Rights" },
  { name: "Mr. Abdul Aleem Khan", portfolio: "Communication", party: "PML(N)" },
  { name: "Mr. Jam Kamal Khan", portfolio: "Commerce", party: "PML(N)" },
  { name: "Mr. Ahsan Iqbal Chaudry", portfolio: "Planning, Development & Special Initiatives", party: "PML(N)" },
  { name: "Dr. Khalid Maqbool Siddiqui", portfolio: "Federal Education & Professional Training", party: "MQM" },
  { name: "Rana Tanveer Hussain", portfolio: "National Food Security & Research", party: "PML(N)" },
  { name: "Engr. Amir Muqam", portfolio: "Kashmir Affairs, GB & SAFRAN", party: "PML(N)" },
  { name: "Sardar Awais Ahmad Khan Leghari", portfolio: "Power", party: "PML(N)" },
  { name: "Mr. Ahad Khan Cheema", portfolio: "Economic Affairs", party: "PML(N)", additional: "Establishment" },
  { name: "Mr. Musadik Masood Malik", portfolio: "Climate Change & Environmental Coordination", party: "PML(N)" },
  { name: "Mr. Qaiser Ahmed Sheikh", portfolio: "Board of Investment", party: "PML(N)" },
  { name: "Mian Riaz Hussain Pirzada", portfolio: "Housing & Works", party: "PML(N)" },
  { name: "Chaudhry Salik Hussain", portfolio: "Overseas Pakistanis & Human Resource Development", party: "PML(Q)" },
  { name: "Dr. Tariq Fazal Chaudhary", portfolio: "Parliamentary Affairs", party: "PML(N)" },
  { name: "Mr. Ali Pervaiz Malik", portfolio: "Petroleum", party: "PML(N)" },
  { name: "Mr. Aurangzeb Khan Khichi", portfolio: "National Heritage & Culture", party: "PML(N)" },
  { name: "Mr. Khalid Hussain Magsi", portfolio: "Science & Technology", party: "BAP" },
  { name: "Mr. Muhammad Hanif Abbasi", portfolio: "Railways", party: "PML(N)" },
  { name: "Mr. Muhammad Mueen Wattoo", portfolio: "Water Resources", party: "PML(N)" },
  { name: "Mr. Muhammad Junaid Anwar", portfolio: "Maritime Affairs", party: "PML(N)" },
  { name: "Syed Mustafa Kamal", portfolio: "National Health Services, Regulations & Coordination", party: "MQM" },
  { name: "Mr. Muhammad Raza Hayat Harraj", portfolio: "Defence Production", party: "PML(N)" },
  { name: "Ms. Shaza Fatima Khawaja", portfolio: "Information Technology & Telecommunication", party: "PML(N)" },
  { name: "Rana Mubashar Iqbal", portfolio: "Public Affairs Unit", party: "PML(N)" },
  { name: "Syed Imran Ahmad Shah", portfolio: "Poverty Alleviation & Social Safety", party: "PML(N)" },
  { name: "Sardar Muhammad Yousaf", portfolio: "Religious Affairs & Interfaith Harmony", party: "PML(N)" },
];

const topOfficials = [
  { name: "Asif Ali Zardari", role: "President of Pakistan", party: "PPP" },
  { name: "Mian Muhammad Shehbaz Sharif", role: "Prime Minister", party: "PML(N)" },
  { name: "Justice Yahya Afridi", role: "Chief Justice of Pakistan", party: "N/A" },
  { name: "Syed Yousaf Raza Gillani", role: "Chairman Senate", party: "PPP" },
  { name: "Sardar Ayaz Sadiq", role: "Speaker National Assembly", party: "PML(N)" },
];

const armedForces = [
  { name: "General Asim Munir", role: "Chief of Army Staff (COAS)", branch: "Pakistan Army" },
  { name: "Air Chief Marshal Zaheer Ahmad Babar", role: "Chief of Air Staff", branch: "Pakistan Air Force" },
  { name: "Admiral Naveed Ashraf", role: "Chief of Naval Staff", branch: "Pakistan Navy" },
  { name: "General Sahir Shamshad Mirza", role: "Chairman Joint Chiefs of Staff Committee", branch: "Joint" },
  { name: "Lt. Gen. Muhammad Asim Malik", role: "Director General ISI", branch: "Pakistan Army" },
];

export default function MinistersPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'top' | 'ministers' | 'forces'>('ministers');

  const filteredMinisters = ministers.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.portfolio.toLowerCase().includes(search.toLowerCase()) ||
    m.party.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">Pakistan Leadership</h1>
        <p className="text-slate-400 text-center mb-6">Federal Cabinet, Top Officials & Armed Forces Chiefs (2026)</p>

        <div className="flex justify-center gap-3 mb-6">
          {[
            { key: 'top' as const, label: 'Top Officials' },
            { key: 'ministers' as const, label: 'Federal Ministers' },
            { key: 'forces' as const, label: 'Armed Forces Chiefs' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'top' && (
          <div className="space-y-4">
            {topOfficials.map((person, i) => (
              <div key={i} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-blue-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-lg">
                    {person.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{person.name}</h3>
                    <p className="text-blue-400">{person.role}</p>
                    {person.party !== 'N/A' && (
                      <span className="text-xs text-slate-500 mt-1 inline-block px-2 py-0.5 bg-slate-700/50 rounded-full">{person.party}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ministers' && (
          <>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, portfolio, or party..."
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors mb-4"
            />
            <p className="text-slate-500 text-sm mb-4">Showing {filteredMinisters.length} ministers</p>
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="px-6 py-4 text-left text-blue-400 font-semibold">#</th>
                      <th className="px-6 py-4 text-left text-blue-400 font-semibold">Name</th>
                      <th className="px-6 py-4 text-left text-blue-400 font-semibold">Portfolio</th>
                      <th className="px-6 py-4 text-left text-blue-400 font-semibold">Party</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMinisters.map((m, i) => (
                      <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                        <td className="px-6 py-3 text-slate-500 font-mono text-sm">{i + 1}</td>
                        <td className="px-6 py-3 text-white font-medium">
                          {m.name}
                          {m.additional && (
                            <span className="block text-xs text-slate-500 mt-0.5">+ {m.additional}</span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-emerald-400">{m.portfolio}</td>
                        <td className="px-6 py-3">
                          <span className="px-2 py-1 text-xs rounded-full bg-slate-700/50 text-slate-300">{m.party}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'forces' && (
          <div className="space-y-4">
            {armedForces.map((person, i) => (
              <div key={i} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-emerald-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
                    {person.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{person.name}</h3>
                    <p className="text-emerald-400">{person.role}</p>
                    <span className="text-xs text-slate-500 mt-1 inline-block px-2 py-0.5 bg-slate-700/50 rounded-full">{person.branch}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
