import { useState } from "react";
import Icon from "@/components/ui/icon";

type Section = "home" | "files" | "folders" | "recent" | "search" | "favorites" | "settings" | "cloud";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: string;
  modified: string;
  shared?: boolean;
  access?: "view" | "edit" | "admin";
  favorite?: boolean;
  extension?: string;
}

interface SharedUser {
  name: string;
  email: string;
  access: "view" | "edit" | "admin";
  avatar: string;
}

const MOCK_FILES: FileItem[] = [
  { id: "1", name: "Проектная документация", type: "folder", modified: "Сегодня, 14:32", shared: true, access: "admin", favorite: true },
  { id: "2", name: "Презентация Q4 2025.pptx", type: "file", size: "4.2 МБ", modified: "Вчера, 10:15", extension: "pptx", shared: true, access: "edit" },
  { id: "3", name: "Финансовый отчёт.xlsx", type: "file", size: "1.8 МБ", modified: "3 апр, 09:44", extension: "xlsx", favorite: true },
  { id: "4", name: "Макеты дизайна", type: "folder", modified: "2 апр, 16:20", shared: true, access: "view" },
  { id: "5", name: "Контракт с партнёром.pdf", type: "file", size: "842 КБ", modified: "1 апр, 11:00", extension: "pdf", shared: true, access: "view" },
  { id: "6", name: "Архив 2024.zip", type: "file", size: "128 МБ", modified: "28 мар, 08:30", extension: "zip" },
  { id: "7", name: "Фото команды", type: "folder", modified: "25 мар, 14:00", favorite: true },
  { id: "8", name: "Техническое задание.docx", type: "file", size: "320 КБ", modified: "20 мар, 12:15", extension: "docx", shared: true, access: "edit" },
];

const RECENT_FILES: FileItem[] = MOCK_FILES.slice(0, 5);
const FAVORITES: FileItem[] = MOCK_FILES.filter(f => f.favorite);

const SHARED_USERS: SharedUser[] = [
  { name: "Алексей Морозов", email: "a.morozov@company.ru", access: "edit", avatar: "АМ" },
  { name: "Екатерина Волкова", email: "e.volkova@company.ru", access: "view", avatar: "ЕВ" },
  { name: "Дмитрий Соколов", email: "d.sokolov@company.ru", access: "admin", avatar: "ДС" },
];

const NAV_ITEMS = [
  { id: "home" as Section, label: "Главная", icon: "LayoutDashboard" },
  { id: "files" as Section, label: "Файлы", icon: "File" },
  { id: "folders" as Section, label: "Папки", icon: "Folder" },
  { id: "recent" as Section, label: "Недавние", icon: "Clock" },
  { id: "search" as Section, label: "Поиск", icon: "Search" },
  { id: "favorites" as Section, label: "Избранное", icon: "Star" },
  { id: "cloud" as Section, label: "Облако", icon: "Cloud" },
  { id: "settings" as Section, label: "Настройки", icon: "Settings" },
];

const EXT_COLORS: Record<string, string> = {
  pdf: "bg-red-50 text-red-500",
  xlsx: "bg-green-50 text-green-600",
  docx: "bg-blue-50 text-blue-500",
  pptx: "bg-orange-50 text-orange-500",
  zip: "bg-zinc-100 text-zinc-500",
};

const ACCESS_LABELS = {
  view: { label: "Просмотр", color: "bg-zinc-100 text-zinc-600" },
  edit: { label: "Редактирование", color: "bg-blue-50 text-blue-600" },
  admin: { label: "Управление", color: "bg-emerald-50 text-emerald-700" },
};

function FileRow({ file, onShare }: { file: FileItem; onShare: (file: FileItem) => void }) {
  const extColor = file.extension ? EXT_COLORS[file.extension] || "bg-zinc-100 text-zinc-500" : "bg-zinc-50 text-zinc-400";
  return (
    <div className="group flex items-center gap-4 px-5 py-3 hover:bg-zinc-50 border-b border-zinc-100 last:border-0 transition-colors cursor-pointer">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${extColor}`}>
        {file.type === "folder"
          ? <Icon name="Folder" size={15} />
          : <span>{file.extension?.toUpperCase().slice(0, 3) || <Icon name="File" size={15} />}</span>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-800 truncate">{file.name}</p>
        <p className="text-xs text-zinc-400 mt-0.5">{file.modified}{file.size ? ` · ${file.size}` : ""}</p>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {file.shared && file.access && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ACCESS_LABELS[file.access].color}`}>
            {ACCESS_LABELS[file.access].label}
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onShare(file); }}
          className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors"
        >
          <Icon name="Share2" size={14} />
        </button>
        <button className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors">
          <Icon name="MoreHorizontal" size={14} />
        </button>
      </div>
      {file.shared && <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 ml-1" />}
    </div>
  );
}

function ShareModal({ file, onClose }: { file: FileItem; onClose: () => void }) {
  const [access, setAccess] = useState<"view" | "edit" | "admin">("view");
  const [email, setEmail] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-[480px] max-w-[95vw]">
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-zinc-800">Поделиться доступом</h3>
            <p className="text-xs text-zinc-400 mt-0.5 truncate max-w-[300px]">{file.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-600">
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="flex gap-2">
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email пользователя..."
              className="flex-1 px-3 py-2 text-sm border border-zinc-200 rounded-lg outline-none focus:border-zinc-400 transition-colors"
            />
            <select
              value={access}
              onChange={e => setAccess(e.target.value as typeof access)}
              className="px-3 py-2 text-sm border border-zinc-200 rounded-lg outline-none focus:border-zinc-400 bg-white cursor-pointer text-zinc-700"
            >
              <option value="view">Просмотр</option>
              <option value="edit">Редактирование</option>
              <option value="admin">Управление</option>
            </select>
            <button className="px-4 py-2 bg-zinc-800 text-white text-sm rounded-lg hover:bg-zinc-700 transition-colors font-medium">
              Добавить
            </button>
          </div>

          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Доступ имеют</p>
            <div className="space-y-1">
              {SHARED_USERS.map(user => (
                <div key={user.email} className="flex items-center gap-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-semibold text-zinc-600 flex-shrink-0">
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-800">{user.name}</p>
                    <p className="text-xs text-zinc-400">{user.email}</p>
                  </div>
                  <select
                    defaultValue={user.access}
                    className="text-xs px-2 py-1 border border-zinc-200 rounded-lg bg-white cursor-pointer outline-none text-zinc-600"
                  >
                    <option value="view">Просмотр</option>
                    <option value="edit">Редактирование</option>
                    <option value="admin">Управление</option>
                  </select>
                  <button className="p-1 text-zinc-300 hover:text-red-400 transition-colors">
                    <Icon name="X" size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-100 flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2 text-sm text-zinc-500">
              <Icon name="Link" size={14} />
              <span>Ссылка на {file.type === "folder" ? "папку" : "файл"}</span>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-800 border border-zinc-200 rounded-lg hover:border-zinc-300 transition-colors">
              <Icon name="Copy" size={12} />
              Скопировать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeSection({ onShare }: { onShare: (f: FileItem) => void }) {
  return (
    <div className="space-y-7">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Всего файлов", value: "1 284", icon: "Files", color: "text-zinc-700" },
          { label: "Общий доступ", value: "38", icon: "Users", color: "text-blue-600" },
          { label: "Использовано", value: "12.4 ГБ", icon: "HardDrive", color: "text-zinc-700" },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-zinc-100 rounded-xl px-5 py-4 hover:border-zinc-200 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-zinc-400 font-medium">{stat.label}</span>
              <Icon name={stat.icon} size={16} className={stat.color} />
            </div>
            <p className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-zinc-700">Недавно открытые</h3>
          <button className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors">Все →</button>
        </div>
        <div className="bg-white border border-zinc-100 rounded-xl overflow-hidden">
          {RECENT_FILES.map(f => <FileRow key={f.id} file={f} onShare={onShare} />)}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-zinc-700">Облачное хранилище</h3>
        </div>
        <div className="bg-white border border-zinc-100 rounded-xl px-5 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-600">12.4 ГБ из 50 ГБ</span>
            <span className="text-xs text-zinc-400">24.8%</span>
          </div>
          <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
            <div className="h-full bg-zinc-700 rounded-full" style={{ width: "24.8%" }} />
          </div>
          <div className="flex items-center gap-5 mt-4 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-zinc-700 inline-block" />Документы 6.1 ГБ</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-zinc-400 inline-block" />Фото 4.2 ГБ</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-zinc-200 inline-block" />Прочее 2.1 ГБ</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilesSection({ files, onShare }: { files: FileItem[]; onShare: (f: FileItem) => void }) {
  const [view, setView] = useState<"list" | "grid">("list");
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button className={`p-1.5 rounded-lg transition-colors ${view === "list" ? "bg-zinc-100 text-zinc-700" : "text-zinc-400 hover:text-zinc-600"}`} onClick={() => setView("list")}><Icon name="List" size={16} /></button>
          <button className={`p-1.5 rounded-lg transition-colors ${view === "grid" ? "bg-zinc-100 text-zinc-700" : "text-zinc-400 hover:text-zinc-600"}`} onClick={() => setView("grid")}><Icon name="LayoutGrid" size={16} /></button>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-700 border border-zinc-200 rounded-lg hover:border-zinc-300 transition-colors">
            <Icon name="ArrowUpDown" size={12} />Сортировка
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 text-white text-xs rounded-lg hover:bg-zinc-700 transition-colors font-medium">
            <Icon name="Plus" size={12} />Загрузить
          </button>
        </div>
      </div>
      {view === "list" ? (
        <div className="bg-white border border-zinc-100 rounded-xl overflow-hidden">
          <div className="flex items-center gap-4 px-5 py-2.5 border-b border-zinc-100 bg-zinc-50">
            <div className="w-8" />
            <span className="flex-1 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Название</span>
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Изменено</span>
          </div>
          {files.map(f => <FileRow key={f.id} file={f} onShare={onShare} />)}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {files.map(f => (
            <div key={f.id} className="group bg-white border border-zinc-100 rounded-xl p-4 hover:border-zinc-200 transition-colors cursor-pointer">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold mb-3 ${f.extension ? EXT_COLORS[f.extension] || "bg-zinc-100 text-zinc-500" : "bg-zinc-50 text-zinc-400"}`}>
                {f.type === "folder" ? <Icon name="Folder" size={18} /> : <span>{f.extension?.toUpperCase().slice(0, 3)}</span>}
              </div>
              <p className="text-sm font-medium text-zinc-800 truncate">{f.name}</p>
              <p className="text-xs text-zinc-400 mt-1">{f.size || f.modified}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SearchSection() {
  const [query, setQuery] = useState("");
  const results = query ? MOCK_FILES.filter(f => f.name.toLowerCase().includes(query.toLowerCase())) : [];
  return (
    <div className="space-y-4">
      <div className="relative">
        <Icon name="Search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Поиск файлов и папок..."
          className="w-full pl-10 pr-4 py-3 text-sm border border-zinc-200 rounded-xl outline-none focus:border-zinc-400 transition-colors bg-white"
          autoFocus
        />
      </div>
      {query && (
        <div className="bg-white border border-zinc-100 rounded-xl overflow-hidden">
          {results.length > 0 ? results.map(f => (
            <FileRow key={f.id} file={f} onShare={() => {}} />
          )) : (
            <div className="py-12 text-center">
              <Icon name="SearchX" size={32} className="text-zinc-200 mx-auto mb-2" />
              <p className="text-sm text-zinc-400">Ничего не найдено по запросу «{query}»</p>
            </div>
          )}
        </div>
      )}
      {!query && (
        <div className="py-16 text-center">
          <Icon name="Search" size={40} className="text-zinc-100 mx-auto mb-3" />
          <p className="text-sm text-zinc-400">Введите название файла или папки</p>
        </div>
      )}
    </div>
  );
}

function CloudSection() {
  return (
    <div className="space-y-5">
      <div className="bg-white border border-zinc-100 rounded-xl px-6 py-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-zinc-800">Облачное хранилище</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Подключено и синхронизировано</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <span className="w-2 h-2 bg-emerald-400 rounded-full" />Онлайн
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-600">12.4 ГБ использовано</span>
            <span className="text-zinc-400">из 50 ГБ</span>
          </div>
          <div className="h-2.5 bg-zinc-100 rounded-full overflow-hidden">
            <div className="h-full bg-zinc-800 rounded-full" style={{ width: "24.8%" }} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { label: "Документы", size: "6.1 ГБ", icon: "FileText", color: "text-blue-500", bg: "bg-blue-50" },
            { label: "Фотографии", size: "4.2 ГБ", icon: "Image", color: "text-purple-500", bg: "bg-purple-50" },
            { label: "Прочее", size: "2.1 ГБ", icon: "Package", color: "text-zinc-400", bg: "bg-zinc-50" },
          ].map(cat => (
            <div key={cat.label} className={`${cat.bg} rounded-xl px-3 py-3`}>
              <Icon name={cat.icon} size={18} className={`${cat.color} mb-2`} />
              <p className="text-xs text-zinc-500">{cat.label}</p>
              <p className="text-sm font-semibold text-zinc-700 mt-0.5">{cat.size}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-zinc-100 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-100 bg-zinc-50">
          <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Синхронизация</h4>
        </div>
        {[
          { name: "Проектная документация", status: "Синхронизировано", time: "1 мин назад", ok: true },
          { name: "Макеты дизайна", status: "Синхронизируется...", time: "", ok: false },
          { name: "Архив 2024.zip", status: "Синхронизировано", time: "2 часа назад", ok: true },
        ].map(item => (
          <div key={item.name} className="flex items-center gap-4 px-5 py-3.5 border-b border-zinc-50 last:border-0">
            <Icon name={item.ok ? "CheckCircle" : "RefreshCw"} size={16} className={item.ok ? "text-emerald-400" : "text-blue-400"} />
            <div className="flex-1">
              <p className="text-sm font-medium text-zinc-700">{item.name}</p>
              <p className="text-xs text-zinc-400">{item.status}{item.time ? ` · ${item.time}` : ""}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsSection() {
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  return (
    <div className="space-y-4 max-w-lg">
      {[
        {
          title: "Аккаунт",
          items: [
            { label: "Имя пользователя", value: "Иван Петров", type: "text" },
            { label: "Email", value: "ivan@company.ru", type: "text" },
          ]
        },
        {
          title: "Хранилище",
          items: [
            { label: "Автосинхронизация", value: autoSync, type: "toggle", onChange: () => setAutoSync(v => !v) },
            { label: "Уведомления о доступе", value: notifications, type: "toggle", onChange: () => setNotifications(v => !v) },
          ]
        },
      ].map(group => (
        <div key={group.title} className="bg-white border border-zinc-100 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-zinc-100 bg-zinc-50">
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{group.title}</h4>
          </div>
          {group.items.map((item: { label: string; value: string | boolean; type: string; onChange?: () => void }) => (
            <div key={item.label} className="flex items-center justify-between px-5 py-4 border-b border-zinc-50 last:border-0">
              <span className="text-sm text-zinc-700">{item.label}</span>
              {item.type === "toggle" ? (
                <button
                  onClick={item.onChange}
                  className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${item.value ? "bg-zinc-800" : "bg-zinc-200"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.value ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              ) : (
                <span className="text-sm text-zinc-400">{item.value}</span>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Index() {
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [shareFile, setShareFile] = useState<FileItem | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const folders = MOCK_FILES.filter(f => f.type === "folder");
  const files = MOCK_FILES.filter(f => f.type === "file");

  const renderContent = () => {
    switch (activeSection) {
      case "home": return <HomeSection onShare={setShareFile} />;
      case "files": return <FilesSection files={files} onShare={setShareFile} />;
      case "folders": return <FilesSection files={folders} onShare={setShareFile} />;
      case "recent": return <FilesSection files={RECENT_FILES} onShare={setShareFile} />;
      case "favorites": return <FilesSection files={FAVORITES} onShare={setShareFile} />;
      case "search": return <SearchSection />;
      case "cloud": return <CloudSection />;
      case "settings": return <SettingsSection />;
      default: return null;
    }
  };

  const currentNav = NAV_ITEMS.find(n => n.id === activeSection);

  return (
    <div className="flex h-screen bg-zinc-50 font-ibm overflow-hidden">
      <aside className={`flex flex-col bg-white border-r border-zinc-100 transition-all duration-300 flex-shrink-0 ${sidebarCollapsed ? "w-14" : "w-56"}`}>
        <div className="flex items-center justify-between px-3 py-4 border-b border-zinc-100">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2.5 pl-1">
              <div className="w-6 h-6 bg-zinc-800 rounded-md flex items-center justify-center flex-shrink-0">
                <Icon name="Layers" size={13} className="text-white" />
              </div>
              <span className="font-semibold text-zinc-800 text-sm tracking-tight">FileSpace</span>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors ${sidebarCollapsed ? "mx-auto" : ""}`}
          >
            <Icon name={sidebarCollapsed ? "ChevronRight" : "ChevronLeft"} size={14} />
          </button>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeSection === item.id
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"
              } ${sidebarCollapsed ? "justify-center" : ""}`}
            >
              <Icon name={item.icon} size={15} />
              {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {!sidebarCollapsed && (
          <div className="px-3 py-4 border-t border-zinc-100">
            <div className="flex items-center gap-2.5 px-1">
              <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-semibold text-zinc-600 flex-shrink-0">ИП</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-zinc-700 truncate">Иван Петров</p>
                <p className="text-xs text-zinc-400 truncate">Про-план · 50 ГБ</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-zinc-100">
          <h1 className="text-sm font-semibold text-zinc-800">{currentNav?.label}</h1>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors">
              <Icon name="Bell" size={15} />
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 text-white text-xs rounded-lg hover:bg-zinc-700 transition-colors font-medium">
              <Icon name="Upload" size={12} />
              Загрузить
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {renderContent()}
        </div>
      </main>

      {shareFile && <ShareModal file={shareFile} onClose={() => setShareFile(null)} />}
    </div>
  );
}