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
  docx: "bg-sky-50 text-sky-500",
  pptx: "bg-amber-50 text-amber-600",
  zip: "bg-stone-100 text-stone-500",
};

const ACCESS_LABELS = {
  view: { label: "Просмотр", color: "bg-stone-100 text-stone-600" },
  edit: { label: "Редактирование", color: "bg-amber-50 text-amber-700" },
  admin: { label: "Управление", color: "bg-emerald-50 text-emerald-700" },
};

// Тёплая палитра — базовые классы
const S = {
  bg: "bg-[hsl(36,33%,95%)]",
  card: "bg-[hsl(36,40%,98%)]",
  border: "border-[hsl(32,18%,85%)]",
  sidebar: "bg-[hsl(36,30%,97%)]",
  text: "text-[hsl(24,20%,18%)]",
  muted: "text-[hsl(24,12%,50%)]",
  accent: "bg-[hsl(16,60%,45%)]",
  accentHover: "hover:bg-[hsl(16,60%,40%)]",
  accentText: "text-[hsl(16,60%,45%)]",
  accentBg: "bg-[hsl(16,55%,92%)]",
  hover: "hover:bg-[hsl(36,25%,92%)]",
  active: "bg-[hsl(16,60%,45%)] text-white",
  navInactive: "text-[hsl(24,12%,48%)] hover:bg-[hsl(36,25%,92%)] hover:text-[hsl(24,20%,22%)]",
};

function FileRow({ file, onShare }: { file: FileItem; onShare: (file: FileItem) => void }) {
  const extColor = file.extension ? EXT_COLORS[file.extension] || "bg-stone-100 text-stone-500" : "bg-stone-50 text-stone-400";
  return (
    <div className={`group flex items-center gap-4 px-5 py-3 ${S.hover} border-b ${S.border} last:border-0 transition-colors cursor-pointer`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${extColor}`}>
        {file.type === "folder"
          ? <Icon name="Folder" size={15} />
          : <span>{file.extension?.toUpperCase().slice(0, 3) || <Icon name="File" size={15} />}</span>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${S.text} truncate`}>{file.name}</p>
        <p className={`text-xs ${S.muted} mt-0.5`}>{file.modified}{file.size ? ` · ${file.size}` : ""}</p>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {file.shared && file.access && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ACCESS_LABELS[file.access].color}`}>
            {ACCESS_LABELS[file.access].label}
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onShare(file); }}
          className={`p-1.5 rounded-lg ${S.hover} ${S.muted} hover:${S.text} transition-colors`}
        >
          <Icon name="Share2" size={14} />
        </button>
        <button className={`p-1.5 rounded-lg ${S.hover} ${S.muted} hover:${S.text} transition-colors`}>
          <Icon name="MoreHorizontal" size={14} />
        </button>
      </div>
      {file.shared && <div className={`w-1.5 h-1.5 rounded-full ${S.accent} flex-shrink-0 ml-1`} />}
    </div>
  );
}

function ShareModal({ file, onClose }: { file: FileItem; onClose: () => void }) {
  const [access, setAccess] = useState<"view" | "edit" | "admin">("view");
  const [email, setEmail] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className={`${S.card} rounded-2xl shadow-2xl w-[480px] max-w-[95vw]`}>
        <div className={`px-6 py-5 border-b ${S.border} flex items-center justify-between`}>
          <div>
            <h3 className={`font-semibold ${S.text}`}>Поделиться доступом</h3>
            <p className={`text-xs ${S.muted} mt-0.5 truncate max-w-[300px]`}>{file.name}</p>
          </div>
          <button onClick={onClose} className={`p-2 rounded-lg ${S.hover} transition-colors ${S.muted}`}>
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="flex gap-2">
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email пользователя..."
              className={`flex-1 px-3 py-2 text-sm border ${S.border} rounded-lg outline-none focus:border-[hsl(16,60%,45%)] transition-colors bg-transparent`}
            />
            <select
              value={access}
              onChange={e => setAccess(e.target.value as typeof access)}
              className={`px-3 py-2 text-sm border ${S.border} rounded-lg outline-none bg-[hsl(36,40%,98%)] cursor-pointer ${S.text}`}
            >
              <option value="view">Просмотр</option>
              <option value="edit">Редактирование</option>
              <option value="admin">Управление</option>
            </select>
            <button className={`px-4 py-2 ${S.accent} text-white text-sm rounded-lg ${S.accentHover} transition-colors font-medium`}>
              Добавить
            </button>
          </div>

          <div>
            <p className={`text-xs font-semibold ${S.muted} uppercase tracking-wider mb-3`}>Доступ имеют</p>
            <div className="space-y-1">
              {SHARED_USERS.map(user => (
                <div key={user.email} className="flex items-center gap-3 py-2">
                  <div className={`w-8 h-8 rounded-full ${S.accentBg} flex items-center justify-center text-xs font-semibold ${S.accentText} flex-shrink-0`}>
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${S.text}`}>{user.name}</p>
                    <p className={`text-xs ${S.muted}`}>{user.email}</p>
                  </div>
                  <select
                    defaultValue={user.access}
                    className={`text-xs px-2 py-1 border ${S.border} rounded-lg bg-[hsl(36,40%,98%)] cursor-pointer outline-none ${S.text}`}
                  >
                    <option value="view">Просмотр</option>
                    <option value="edit">Редактирование</option>
                    <option value="admin">Управление</option>
                  </select>
                  <button className={`p-1 ${S.muted} hover:text-red-400 transition-colors`}>
                    <Icon name="X" size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={`pt-2 border-t ${S.border} flex items-center gap-3`}>
            <div className={`flex-1 flex items-center gap-2 text-sm ${S.muted}`}>
              <Icon name="Link" size={14} />
              <span>Ссылка на {file.type === "folder" ? "папку" : "файл"}</span>
            </div>
            <button className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium ${S.muted} hover:${S.text} border ${S.border} rounded-lg hover:border-[hsl(32,18%,72%)] transition-colors`}>
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
          { label: "Всего файлов", value: "1 284", icon: "Files" },
          { label: "Общий доступ", value: "38", icon: "Users" },
          { label: "Использовано", value: "12.4 ГБ", icon: "HardDrive" },
        ].map((stat, i) => (
          <div key={stat.label} className={`${S.card} border ${S.border} rounded-xl px-5 py-4 hover:border-[hsl(32,18%,72%)] transition-colors`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs ${S.muted} font-medium`}>{stat.label}</span>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${i === 1 ? S.accentBg : "bg-stone-100"}`}>
                <Icon name={stat.icon} size={14} className={i === 1 ? S.accentText : "text-stone-500"} />
              </div>
            </div>
            <p className={`text-2xl font-semibold ${S.text}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-sm font-semibold ${S.text}`}>Недавно открытые</h3>
          <button className={`text-xs ${S.muted} hover:${S.accentText} transition-colors`}>Все →</button>
        </div>
        <div className={`${S.card} border ${S.border} rounded-xl overflow-hidden`}>
          {RECENT_FILES.map(f => <FileRow key={f.id} file={f} onShare={onShare} />)}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-sm font-semibold ${S.text}`}>Облачное хранилище</h3>
        </div>
        <div className={`${S.card} border ${S.border} rounded-xl px-5 py-4`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${S.text}`}>12.4 ГБ из 50 ГБ</span>
            <span className={`text-xs ${S.muted}`}>24.8%</span>
          </div>
          <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
            <div className={`h-full ${S.accent} rounded-full`} style={{ width: "24.8%" }} />
          </div>
          <div className={`flex items-center gap-5 mt-4 text-xs ${S.muted}`}>
            <div className="flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full ${S.accent} inline-block`} />Документы 6.1 ГБ</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-300 inline-block" />Фото 4.2 ГБ</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-stone-200 inline-block" />Прочее 2.1 ГБ</div>
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
          <button className={`p-1.5 rounded-lg transition-colors ${view === "list" ? `${S.accentBg} ${S.accentText}` : `${S.muted} ${S.hover}`}`} onClick={() => setView("list")}><Icon name="List" size={16} /></button>
          <button className={`p-1.5 rounded-lg transition-colors ${view === "grid" ? `${S.accentBg} ${S.accentText}` : `${S.muted} ${S.hover}`}`} onClick={() => setView("grid")}><Icon name="LayoutGrid" size={16} /></button>
        </div>
        <div className="flex items-center gap-2">
          <button className={`flex items-center gap-1.5 px-3 py-1.5 text-xs ${S.muted} border ${S.border} rounded-lg hover:border-[hsl(32,18%,72%)] transition-colors`}>
            <Icon name="ArrowUpDown" size={12} />Сортировка
          </button>
          <button className={`flex items-center gap-1.5 px-3 py-1.5 ${S.accent} text-white text-xs rounded-lg ${S.accentHover} transition-colors font-medium`}>
            <Icon name="Plus" size={12} />Загрузить
          </button>
        </div>
      </div>
      {view === "list" ? (
        <div className={`${S.card} border ${S.border} rounded-xl overflow-hidden`}>
          <div className={`flex items-center gap-4 px-5 py-2.5 border-b ${S.border} bg-[hsl(36,25%,93%)]`}>
            <div className="w-8" />
            <span className={`flex-1 text-xs font-semibold ${S.muted} uppercase tracking-wider`}>Название</span>
            <span className={`text-xs font-semibold ${S.muted} uppercase tracking-wider`}>Изменено</span>
          </div>
          {files.map(f => <FileRow key={f.id} file={f} onShare={onShare} />)}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {files.map(f => (
            <div key={f.id} className={`group ${S.card} border ${S.border} rounded-xl p-4 hover:border-[hsl(32,18%,72%)] transition-colors cursor-pointer`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold mb-3 ${f.extension ? EXT_COLORS[f.extension] || "bg-stone-100 text-stone-500" : "bg-stone-50 text-stone-400"}`}>
                {f.type === "folder" ? <Icon name="Folder" size={18} /> : <span>{f.extension?.toUpperCase().slice(0, 3)}</span>}
              </div>
              <p className={`text-sm font-medium ${S.text} truncate`}>{f.name}</p>
              <p className={`text-xs ${S.muted} mt-1`}>{f.size || f.modified}</p>
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
        <Icon name="Search" size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${S.muted}`} />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Поиск файлов и папок..."
          className={`w-full pl-10 pr-4 py-3 text-sm border ${S.border} rounded-xl outline-none focus:border-[hsl(16,60%,45%)] transition-colors ${S.card} bg-[hsl(36,40%,98%)]`}
          autoFocus
        />
      </div>
      {query && (
        <div className={`${S.card} border ${S.border} rounded-xl overflow-hidden`}>
          {results.length > 0 ? results.map(f => (
            <FileRow key={f.id} file={f} onShare={() => {}} />
          )) : (
            <div className="py-12 text-center">
              <Icon name="SearchX" size={32} className="text-stone-200 mx-auto mb-2" />
              <p className={`text-sm ${S.muted}`}>Ничего не найдено по запросу «{query}»</p>
            </div>
          )}
        </div>
      )}
      {!query && (
        <div className="py-16 text-center">
          <Icon name="Search" size={40} className="text-stone-200 mx-auto mb-3" />
          <p className={`text-sm ${S.muted}`}>Введите название файла или папки</p>
        </div>
      )}
    </div>
  );
}

function CloudSection() {
  return (
    <div className="space-y-5">
      <div className={`${S.card} border ${S.border} rounded-xl px-6 py-5`}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className={`font-semibold ${S.text}`}>Облачное хранилище</h3>
            <p className={`text-xs ${S.muted} mt-0.5`}>Подключено и синхронизировано</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <span className="w-2 h-2 bg-emerald-400 rounded-full" />Онлайн
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className={S.text}>12.4 ГБ использовано</span>
            <span className={S.muted}>из 50 ГБ</span>
          </div>
          <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden">
            <div className={`h-full ${S.accent} rounded-full`} style={{ width: "24.8%" }} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { label: "Документы", size: "6.1 ГБ", icon: "FileText", color: "text-sky-500", bg: "bg-sky-50" },
            { label: "Фотографии", size: "4.2 ГБ", icon: "Image", color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Прочее", size: "2.1 ГБ", icon: "Package", color: "text-stone-400", bg: "bg-stone-50" },
          ].map(cat => (
            <div key={cat.label} className={`${cat.bg} rounded-xl px-3 py-3`}>
              <Icon name={cat.icon} size={18} className={`${cat.color} mb-2`} />
              <p className={`text-xs ${S.muted}`}>{cat.label}</p>
              <p className={`text-sm font-semibold ${S.text} mt-0.5`}>{cat.size}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={`${S.card} border ${S.border} rounded-xl overflow-hidden`}>
        <div className={`px-5 py-3 border-b ${S.border} bg-[hsl(36,25%,93%)]`}>
          <h4 className={`text-xs font-semibold ${S.muted} uppercase tracking-wider`}>Синхронизация</h4>
        </div>
        {[
          { name: "Проектная документация", status: "Синхронизировано", time: "1 мин назад", ok: true },
          { name: "Макеты дизайна", status: "Синхронизируется...", time: "", ok: false },
          { name: "Архив 2024.zip", status: "Синхронизировано", time: "2 часа назад", ok: true },
        ].map(item => (
          <div key={item.name} className={`flex items-center gap-4 px-5 py-3.5 border-b ${S.border} last:border-0`}>
            <Icon name={item.ok ? "CheckCircle" : "RefreshCw"} size={16} className={item.ok ? "text-emerald-400" : `${S.accentText}`} />
            <div className="flex-1">
              <p className={`text-sm font-medium ${S.text}`}>{item.name}</p>
              <p className={`text-xs ${S.muted}`}>{item.status}{item.time ? ` · ${item.time}` : ""}</p>
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
        <div key={group.title} className={`${S.card} border ${S.border} rounded-xl overflow-hidden`}>
          <div className={`px-5 py-3 border-b ${S.border} bg-[hsl(36,25%,93%)]`}>
            <h4 className={`text-xs font-semibold ${S.muted} uppercase tracking-wider`}>{group.title}</h4>
          </div>
          {group.items.map((item: { label: string; value: string | boolean; type: string; onChange?: () => void }) => (
            <div key={item.label} className={`flex items-center justify-between px-5 py-4 border-b ${S.border} last:border-0`}>
              <span className={`text-sm ${S.text}`}>{item.label}</span>
              {item.type === "toggle" ? (
                <button
                  onClick={item.onChange}
                  className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${item.value ? S.accent : "bg-stone-200"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.value ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              ) : (
                <span className={`text-sm ${S.muted}`}>{item.value as string}</span>
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
    <div className={`flex h-screen ${S.bg} font-raleway overflow-hidden`}>
      {/* Sidebar */}
      <aside className={`flex flex-col ${S.sidebar} border-r ${S.border} transition-all duration-300 flex-shrink-0 ${sidebarCollapsed ? "w-14" : "w-56"}`}>
        <div className={`flex items-center justify-between px-3 py-4 border-b ${S.border}`}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2.5 pl-1">
              <div className={`w-6 h-6 ${S.accent} rounded-md flex items-center justify-center flex-shrink-0`}>
                <Icon name="Layers" size={13} className="text-white" />
              </div>
              <span className={`font-bold ${S.text} text-sm tracking-tight`}>FileSpace</span>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`p-1.5 rounded-lg ${S.hover} ${S.muted} transition-colors ${sidebarCollapsed ? "mx-auto" : ""}`}
          >
            <Icon name={sidebarCollapsed ? "ChevronRight" : "ChevronLeft"} size={14} />
          </button>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors font-medium ${
                activeSection === item.id ? S.active : S.navInactive
              } ${sidebarCollapsed ? "justify-center" : ""}`}
            >
              <Icon name={item.icon} size={15} />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {!sidebarCollapsed && (
          <div className={`px-3 py-4 border-t ${S.border}`}>
            <div className="flex items-center gap-2.5 px-1">
              <div className={`w-7 h-7 rounded-full ${S.accentBg} flex items-center justify-center text-xs font-semibold ${S.accentText} flex-shrink-0`}>ИП</div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold ${S.text} truncate`}>Иван Петров</p>
                <p className={`text-xs ${S.muted} truncate`}>Про-план · 50 ГБ</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className={`flex items-center justify-between px-6 py-4 ${S.card} border-b ${S.border}`}>
          <h1 className={`text-sm font-semibold ${S.text}`}>{currentNav?.label}</h1>
          <div className="flex items-center gap-2">
            <button className={`p-2 rounded-lg ${S.hover} ${S.muted} transition-colors`}>
              <Icon name="Bell" size={15} />
            </button>
            <button className={`flex items-center gap-1.5 px-3 py-1.5 ${S.accent} text-white text-xs rounded-lg ${S.accentHover} transition-colors font-semibold`}>
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
