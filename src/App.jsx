import React, { useState, useEffect } from 'react';
import { Copy, FileText, Settings, RefreshCw, Check, Code, Eye } from 'lucide-react';

const App = () => { // Đã đổi tên từ ExamHeaderGen thành App
  // State lưu trữ thông tin nhập liệu
  const [formData, setFormData] = useState({
    university: 'TRƯỜNG ĐẠI HỌC BÁCH KHOA',
    department: 'KHOA CÔNG NGHỆ THÔNG TIN',
    examName: 'ĐỀ THI KẾT THÚC HỌC PHẦN',
    semester: 'Học kỳ 1 - Năm học 2024-2025',
    subjectName: 'Nhập môn Trí tuệ Nhân tạo',
    subjectCode: 'IT3010',
    credits: '3',
    examType: 'Được phép sử dụng tài liệu',
    duration: '90',
    examId: '01',
    includeLogo: true,
  });

  const [activeTab, setActiveTab] = useState('preview');
  const [copied, setCopied] = useState(false);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Hàm tạo code LaTeX
  const generateLatexCode = () => {
    const logoCode = formData.includeLogo 
      ? `\\multirow{3}{*}{\\includegraphics[width=2cm]{logo.png}}` 
      : ``;
    
    // Chúng ta sử dụng tabular để căn chỉnh header chuẩn nhất
    return `% --- Bắt đầu Header Đề thi ---
\\begin{table}[h]
    \\centering
    \\begin{tabular}{ll}
        \\begin{minipage}[t]{0.4\\textwidth}
            \\centering
            \\textbf{${formData.university.toUpperCase()}} \\\\
            \\textbf{${formData.department.toUpperCase()}}
            ${formData.includeLogo ? `\\par\\vspace{0.5cm} \\textit{[Nơi đặt Logo]} ` : ''}
        \\end{minipage} & 
        \\begin{minipage}[t]{0.55\\textwidth}
            \\centering
            \\textbf{${formData.examName.toUpperCase()}} \\\\
            \\textit{${formData.semester}} \\\\
            \\vspace{0.2cm}
            \\textbf{Học phần: ${formData.subjectName}} \\\\
            Mã học phần: ${formData.subjectCode} \\quad - \\quad Số tín chỉ: ${formData.credits}
        \\end{minipage}
    \\end{tabular}
\\end{table}

\\noindent
\\begin{tabular}{|p{0.3\\textwidth}|p{0.3\\textwidth}|p{0.3\\textwidth}|}
    \\hline
    \\textbf{Đề số: ${formData.examId}} & \\textbf{Thời gian: ${formData.duration} phút} & \\textbf{${formData.examType}} \\\\
    \\hline
\\end{tabular}
\\vspace{0.5cm}
% --- Kết thúc Header Đề thi ---
`;
  };

  const handleCopy = () => {
    const code = generateLatexCode();
    // Fallback copy method
    const textArea = document.createElement("textarea");
    textArea.value = code;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Không thể copy', err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      {/* Thêm một style cơ bản nếu bạn chưa cài Tailwind CSS */}
      <style>{`
        .input-style {
          border: 1px solid #ccc;
          padding: 8px 12px;
          border-radius: 6px;
          width: 100%;
          color: black;
          background-color: white;
        }
        .shadow-lg {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
      `}</style>
      
      <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Cột trái: Form nhập liệu */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-full">
          <div className="bg-blue-600 p-4 text-white flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Thông tin đề thi
            </h2>
          </div>
          
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            {/* Nhóm thông tin trường */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider border-b pb-1">Đơn vị đào tạo</h3>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">Tên trường</label>
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    className="input-style"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">Khoa / Bộ môn</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="input-style"
                  />
                </div>
              </div>
            </div>

            {/* Nhóm thông tin kỳ thi */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider border-b pb-1">Kỳ thi & Học phần</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1 text-slate-700">Tên kỳ thi</label>
                  <input
                    type="text"
                    name="examName"
                    value={formData.examName}
                    onChange={handleChange}
                    className="input-style"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1 text-slate-700">Học kỳ / Năm học</label>
                  <input
                    type="text"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="input-style"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1 text-slate-700">Tên học phần</label>
                  <input
                    type="text"
                    name="subjectName"
                    value={formData.subjectName}
                    onChange={handleChange}
                    className="input-style"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">Mã HP</label>
                  <input
                    type="text"
                    name="subjectCode"
                    value={formData.subjectCode}
                    onChange={handleChange}
                    className="input-style"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">Số tín chỉ</label>
                  <input
                    type="text"
                    name="credits"
                    value={formData.credits}
                    onChange={handleChange}
                    className="input-style"
                  />
                </div>
              </div>
            </div>

            {/* Nhóm chi tiết đề */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider border-b pb-1">Chi tiết đề thi</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                 <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">Mã đề</label>
                  <input
                    type="text"
                    name="examId"
                    value={formData.examId}
                    onChange={handleChange}
                    className="input-style"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">Thời gian (phút)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="input-style"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">Hình thức</label>
                  <select
                    name="examType"
                    value={formData.examType}
                    onChange={handleChange}
                    className="input-style"
                  >
                    <option value="Được phép sử dụng tài liệu">Sử dụng tài liệu</option>
                    <option value="Không được sử dụng tài liệu">Không dùng tài liệu</option>
                    <option value="Đề mở">Đề mở</option>
                  </select>
                </div>
              </div>
               <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="includeLogo"
                  name="includeLogo"
                  checked={formData.includeLogo}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="includeLogo" className="ml-2 text-sm text-slate-700">
                  Chừa chỗ cho Logo (Cần file logo.png trong thư mục LaTeX)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải: Preview và Code */}
        <div className="flex flex-col h-full space-y-4">
          {/* Tabs */}
          <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex space-x-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'preview' 
                  ? 'bg-blue-100 text-blue-700 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Eye className="w-4 h-4" /> Xem trước (Mô phỏng)
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'code' 
                  ? 'bg-blue-100 text-blue-700 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Code className="w-4 h-4" /> Lấy Code LaTeX
            </button>
          </div>

          {/* Nội dung Tab */}
          <div className="flex-1 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden relative">
            {activeTab === 'preview' ? (
              <div className="p-8 h-full overflow-y-auto bg-white">
                <div className="border border-black p-1 max-w-2xl mx-auto bg-white">
                  {/* Header Table Simulation */}
                  <div className="grid grid-cols-10 gap-4 mb-4">
                    <div className="col-span-4 text-center border-r border-dashed border-gray-300 pr-2">
                      <p className="font-bold text-sm uppercase">{formData.university}</p>
                      <p className="font-bold text-xs uppercase mb-4">{formData.department}</p>
                      {formData.includeLogo && (
                        <div className="w-16 h-16 mx-auto border border-gray-400 bg-gray-100 flex items-center justify-center text-xs text-gray-500 rounded-full">
                          Logo
                        </div>
                      )}
                    </div>
                    <div className="col-span-6 text-center pl-2">
                      <p className="font-bold text-base uppercase">{formData.examName}</p>
                      <p className="italic text-sm mb-2">{formData.semester}</p>
                      <p className="font-bold text-sm">Học phần: {formData.subjectName}</p>
                      <p className="text-sm">Mã HP: {formData.subjectCode} - Số TC: {formData.credits}</p>
                    </div>
                  </div>
                  
                  {/* Exam Details Simulation */}
                  <div className="border-t-2 border-b-2 border-black py-2 mb-8">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="w-1/3 text-center border-r border-black">Đề số: {formData.examId}</span>
                      <span className="w-1/3 text-center border-r border-black">Thời gian: {formData.duration} phút</span>
                      <span className="w-1/3 text-center">{formData.examType}</span>
                    </div>
                  </div>

                  {/* Body Placeholder */}
                  <div className="space-y-4 opacity-50 px-4">
                    <p className="font-bold">Câu 1 (2 điểm):</p>
                    <div className="h-4 bg-gray-200 w-full rounded"></div>
                    <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
                    <p className="font-bold mt-4">Câu 2 (3 điểm):</p>
                    <div className="h-4 bg-gray-200 w-full rounded"></div>
                    <div className="h-4 bg-gray-200 w-5/6 rounded"></div>
                  </div>
                  <div className="text-center mt-12 italic text-xs text-gray-500">
                    (Cán bộ coi thi không giải thích gì thêm)
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="bg-slate-800 text-slate-300 p-2 text-xs flex justify-between items-center">
                   <span>Header Only (.tex)</span>
                   <span className="italic opacity-75">UTF-8 Encoded</span>
                </div>
                <textarea
                  readOnly
                  value={generateLatexCode()}
                  className="flex-1 w-full bg-slate-900 text-green-400 p-4 font-mono text-sm resize-none focus:outline-none"
                  spellCheck="false"
                />
                <button
                  onClick={handleCopy}
                  className={`absolute top-12 right-6 flex items-center gap-2 px-4 py-2 rounded-lg font-bold shadow-lg transition-all transform hover:-translate-y-1 ${
                    copied 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Đã chép!' : 'Sao chép Code'}
                </button>
              </div>
            )}
          </div>
          
           <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-xs text-yellow-800 flex gap-2">
             <div className="font-bold">Lưu ý:</div>
             <div>
               Nếu bạn dùng logo, hãy đảm bảo có file <code>logo.png</code> cùng thư mục với file `.tex` của bạn và đã khai báo <code>\usepackage{'{graphicx}'}</code> trong file chính.
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default App;