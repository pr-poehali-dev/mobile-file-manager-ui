import { useState } from "react";
import Icon from "@/components/ui/icon";

type Section = "home" | "files" | "search" | "favorites" | "settings";

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

const RECENT_FILES: FileItem[] = MOCK_FILES.slice(0, 4);
const FAVORITES: FileItem[] = MOCK_FILES.filter(f => f.favorite);

const SHARED_USERS: SharedUser[] = [
  { name: "Алексей Морозов", email: "a.morozov@company.ru", access: "edit", avatar: "АМ" },
  { name: "Екатерина Волкова", email: "e.volkova@company.ru", access: "view", avatar: "ЕВ" },
  { name: "Дмитрий Соколов", email: "d.sokolov@company.ru", access: "admin", avatar: "ДС" },
];

const BOTTOM_NAV = [
  { id: "home" as Section, label: "Главная", icon: "LayoutDashboard" },
  { id: "files" as Section, label: "Файлы", icon: "FolderOpen" },
  { id: "search" as Section, label: "Поиск", icon: "Search" },
  { id: "favorites" as Section, label: "Избранное", icon: "Star" },
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

const S = {
  bg: "bg-[hsl(36,33%,95%)]",
  card: "bg-[hsl(36,40%,98%)]",
  border: "border-[hsl(32,18%,85%)]",
  text: "text-[hsl(24,20%,18%)]",
  muted: "text-[hsl(24,12%,50%)]",
  accent: "bg-[hsl(16,60%,45%)]",
  accentHover: "hover:bg-[hsl(16,60%,40%)]",
  accentActive: "active:bg-[hsl(16,60%,38%)]",
  accentText: "text-[hsl(16,60%,45%)]",
  accentBg: "bg-[hsl(16,55%,92%)]",
  hover: "hover:bg-[hsl(36,25%,92%)]",
  active: "bg-[hsl(16,60%,45%)] text-white",
  divider: "divide-[hsl(32,18%,85%)]",
};

// --- Share Sheet (мобильный bottom sheet) ---
function ShareSheet({ file, onClose }: { file: FileItem; onClose: () => void }) {
  const [access, setAccess] = useState<"view" | "edit" | "admin">("view");
  const [email, setEmail] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative ${S.card} rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col`}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-stone-200" />
        </div>

        {/* Header */}
        <div className={`px-5 py-3 border-b ${S.border} flex items-center justify-between`}>
          <div>
            <p className={`text-base font-semibold ${S.text}`}>Поделиться</p>
            <p className={`text-xs ${S.muted} truncate max-w-[220px]`}>{file.name}</p>
          </div>
          <button onClick={onClose} className={`w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center ${S.muted}`}>
            <Icon name="X" size={15} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">
          {/* Add user */}
          <div className="space-y-2">
            <p className={`text-xs font-semibold ${S.muted} uppercase tracking-wider`}>Добавить пользователя</p>
            <div className={`flex gap-2 p-1 border ${S.border} rounded-2xl bg-stone-50`}>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email..."
                className="flex-1 px-3 py-2 text-sm bg-transparent outline-none"
              />
              <select
                value={access}
                onChange={e => setAccess(e.target.value as typeof access)}
                className="text-xs px-2 py-1.5 rounded-xl bg-white border border-stone-200 outline-none cursor-pointer"
              >
                <option value="view">Просмотр</option>
                <option value="edit">Редактирование</option>
                <option value="admin">Управление</option>
              </select>
            </div>
            <button className={`w-full py-2.5 ${S.accent} text-white text-sm font-semibold rounded-xl ${S.accentHover} ${S.accentActive} transition-colors`}>
              Добавить
            </button>
          </div>

          {/* Current users */}
          <div className="space-y-2">
            <p className={`text-xs font-semibold ${S.muted} uppercase tracking-wider`}>Имеют доступ</p>
            <div className={`${S.card} border ${S.border} rounded-2xl overflow-hidden divide-y ${S.divider}`}>
              {SHARED_USERS.map(user => (
                <div key={user.email} className="flex items-center gap-3 px-4 py-3">
                  <div className={`w-9 h-9 rounded-full ${S.accentBg} flex items-center justify-center text-xs font-bold ${S.accentText} flex-shrink-0`}>
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${S.text} truncate`}>{user.name}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${ACCESS_LABELS[user.access].color} font-medium`}>
                      {ACCESS_LABELS[user.access].label}
                    </span>
                  </div>
                  <button className={`${S.muted} hover:text-red-400 transition-colors`}>
                    <Icon name="X" size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Copy link */}
          <button className={`w-full flex items-center justify-center gap-2 py-2.5 border ${S.border} rounded-xl text-sm font-medium ${S.muted} ${S.hover} transition-colors`}>
            <Icon name="Link" size={15} />
            Скопировать ссылку
          </button>
        </div>
      </div>
    </div>
  );
}

// --- File card (mobile) ---
function MobileFileRow({ file, onShare }: { file: FileItem; onShare: (f: FileItem) => void }) {
  const extColor = file.extension ? EXT_COLORS[file.extension] || "bg-stone-100 text-stone-500" : "bg-stone-50 text-stone-400";
  return (
    <div className={`flex items-center gap-3 px-4 py-3.5 active:bg-stone-50 transition-colors cursor-pointer border-b ${S.border} last:border-0`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${extColor}`}>
        {file.type === "folder"
          ? <Icon name="Folder" size={18} />
          : <span className="text-[10px]">{file.extension?.toUpperCase().slice(0, 3)}</span>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${S.text} truncate`}>{file.name}</p>
        <p className={`text-xs ${S.muted} mt-0.5`}>{file.modified}{file.size ? ` · ${file.size}` : ""}</p>
      </div>
      <div className="flex items-center gap-1.5">
        {file.shared && <div className={`w-1.5 h-1.5 rounded-full ${S.accent}`} />}
        <button
          onClick={e => { e.stopPropagation(); onShare(file); }}
          className={`p-2 rounded-lg ${S.muted} active:bg-stone-100 transition-colors`}
        >
          <Icon name="MoreVertical" size={16} />
        </button>
      </div>
    </div>
  );
}

// --- Sections ---
function HomeScreen({ onShare, onNav }: { onShare: (f: FileItem) => void; onNav: (s: Section) => void }) {
  return (
    <div className="space-y-5 pb-2">
      {/* Storage card */}
      <div className={`${S.accent} rounded-2xl px-5 py-5 text-white mx-1`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-medium opacity-75">Облачное хранилище</p>
            <p className="text-2xl font-bold mt-0.5">12.4 <span className="text-base font-semibold opacity-80">ГБ</span></p>
            <p className="text-xs opacity-60 mt-0.5">из 50 ГБ используется</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
            <Icon name="Cloud" size={26} className="text-white" />
          </div>
        </div>
        <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full" style={{ width: "24.8%" }} />
        </div>
        <div className="flex justify-between text-xs opacity-60 mt-1.5">
          <span>24.8% заполнено</span>
          <span>37.6 ГБ свободно</span>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <p className={`text-xs font-semibold ${S.muted} uppercase tracking-wider px-1 mb-3`}>Быстрые действия</p>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Загрузить", icon: "Upload", color: "bg-sky-50 text-sky-600" },
            { label: "Папка", icon: "FolderPlus", color: "bg-amber-50 text-amber-600" },
            { label: "Документ", icon: "FilePlus", color: "bg-green-50 text-green-600" },
            { label: "Камера", icon: "Camera", color: `${S.accentBg} ${S.accentText}` },
          ].map(a => (
            <button key={a.label} className={`${S.card} border ${S.border} rounded-2xl py-3 flex flex-col items-center gap-1.5 active:scale-95 transition-transform`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${a.color}`}>
                <Icon name={a.icon} size={18} />
              </div>
              <span className={`text-[10px] font-medium ${S.muted}`}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Файлов", value: "1 284", icon: "Files" },
          { label: "Папок", value: "148", icon: "Folder" },
          { label: "Общих", value: "38", icon: "Users" },
        ].map(st => (
          <div key={st.label} className={`${S.card} border ${S.border} rounded-2xl px-3 py-3 text-center`}>
            <Icon name={st.icon} size={16} className={`${S.accentText} mx-auto mb-1`} />
            <p className={`text-base font-bold ${S.text}`}>{st.value}</p>
            <p className={`text-[10px] ${S.muted}`}>{st.label}</p>
          </div>
        ))}
      </div>

      {/* Recent */}
      <div>
        <div className="flex items-center justify-between px-1 mb-3">
          <p className={`text-xs font-semibold ${S.muted} uppercase tracking-wider`}>Недавние</p>
          <button onClick={() => onNav("files")} className={`text-xs font-semibold ${S.accentText}`}>Все →</button>
        </div>
        <div className={`${S.card} border ${S.border} rounded-2xl overflow-hidden`}>
          {RECENT_FILES.map(f => <MobileFileRow key={f.id} file={f} onShare={onShare} />)}
        </div>
      </div>
    </div>
  );
}

function FilesScreen({ onShare }: { onShare: (f: FileItem) => void }) {
  const [tab, setTab] = useState<"all" | "folders" | "files">("all");
  const filtered = tab === "folders"
    ? MOCK_FILES.filter(f => f.type === "folder")
    : tab === "files"
    ? MOCK_FILES.filter(f => f.type === "file")
    : MOCK_FILES;

  return (
    <div className="space-y-4 pb-2">
      {/* Tabs */}
      <div className={`flex gap-1 p-1 ${S.card} border ${S.border} rounded-2xl`}>
        {([["all", "Все"], ["folders", "Папки"], ["files", "Файлы"]] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${tab === key ? `${S.accent} text-white` : S.muted}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Sort row */}
      <div className="flex items-center justify-between px-1">
        <p className={`text-xs ${S.muted}`}>{filtered.length} элементов</p>
        <button className={`flex items-center gap-1 text-xs font-medium ${S.muted} border ${S.border} rounded-lg px-2.5 py-1.5`}>
          <Icon name="ArrowUpDown" size={11} />Сортировка
        </button>
      </div>

      <div className={`${S.card} border ${S.border} rounded-2xl overflow-hidden`}>
        {filtered.map(f => <MobileFileRow key={f.id} file={f} onShare={onShare} />)}
      </div>
    </div>
  );
}

function SearchScreen() {
  const [query, setQuery] = useState("");
  const results = query ? MOCK_FILES.filter(f => f.name.toLowerCase().includes(query.toLowerCase())) : [];

  return (
    <div className="space-y-4 pb-2">
      <div className={`flex items-center gap-2 border ${S.border} rounded-2xl px-4 py-2.5 ${S.card}`}>
        <Icon name="Search" size={16} className={S.muted} />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Поиск файлов и папок..."
          className="flex-1 text-sm bg-transparent outline-none"
          autoFocus
        />
        {query && (
          <button onClick={() => setQuery("")} className={S.muted}>
            <Icon name="X" size={15} />
          </button>
        )}
      </div>

      {!query && (
        <div>
          <p className={`text-xs font-semibold ${S.muted} uppercase tracking-wider px-1 mb-3`}>Недавние поиски</p>
          <div className="flex flex-wrap gap-2">
            {["Отчёт", "Презентация", "Контракт", "Макеты"].map(tag => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className={`px-3 py-1.5 ${S.card} border ${S.border} rounded-full text-sm ${S.muted}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {query && results.length > 0 && (
        <div className={`${S.card} border ${S.border} rounded-2xl overflow-hidden`}>
          {results.map(f => <MobileFileRow key={f.id} file={f} onShare={() => {}} />)}
        </div>
      )}

      {query && results.length === 0 && (
        <div className="py-16 text-center">
          <Icon name="SearchX" size={40} className="text-stone-200 mx-auto mb-3" />
          <p className={`text-sm ${S.muted}`}>Ничего не найдено</p>
        </div>
      )}
    </div>
  );
}

function FavoritesScreen({ onShare }: { onShare: (f: FileItem) => void }) {
  return (
    <div className="pb-2">
      {FAVORITES.length > 0 ? (
        <div className={`${S.card} border ${S.border} rounded-2xl overflow-hidden`}>
          {FAVORITES.map(f => <MobileFileRow key={f.id} file={f} onShare={onShare} />)}
        </div>
      ) : (
        <div className="py-20 text-center">
          <Icon name="Star" size={40} className="text-stone-200 mx-auto mb-3" />
          <p className={`text-sm ${S.muted}`}>Нет избранных файлов</p>
        </div>
      )}
    </div>
  );
}

function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [biometric, setBiometric] = useState(false);

  return (
    <div className="space-y-4 pb-2">
      {/* Profile */}
      <div className={`${S.card} border ${S.border} rounded-2xl px-4 py-4 flex items-center gap-4`}>
        <div className={`w-14 h-14 rounded-2xl ${S.accentBg} flex items-center justify-center text-xl font-bold ${S.accentText}`}>ИП</div>
        <div className="flex-1">
          <p className={`font-semibold ${S.text}`}>Иван Петров</p>
          <p className={`text-xs ${S.muted} mt-0.5`}>ivan@company.ru</p>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${S.accent} text-white font-semibold mt-1 inline-block`}>Про-план</span>
        </div>
        <Icon name="ChevronRight" size={16} className={S.muted} />
      </div>

      {/* Toggles */}
      {[
        { title: "Хранилище и синхронизация", items: [
          { label: "Автосинхронизация", sub: "Синхронизировать при Wi-Fi", value: autoSync, toggle: () => setAutoSync(v => !v) },
          { label: "Уведомления", sub: "О доступе и изменениях", value: notifications, toggle: () => setNotifications(v => !v) },
          { label: "Биометрия", sub: "Вход по отпечатку или Face ID", value: biometric, toggle: () => setBiometric(v => !v) },
        ]},
      ].map(group => (
        <div key={group.title}>
          <p className={`text-xs font-semibold ${S.muted} uppercase tracking-wider px-1 mb-2`}>{group.title}</p>
          <div className={`${S.card} border ${S.border} rounded-2xl overflow-hidden divide-y ${S.divider}`}>
            {group.items.map(item => (
              <div key={item.label} className="flex items-center gap-3 px-4 py-3.5">
                <div className="flex-1">
                  <p className={`text-sm font-medium ${S.text}`}>{item.label}</p>
                  <p className={`text-xs ${S.muted}`}>{item.sub}</p>
                </div>
                <button
                  onClick={item.toggle}
                  className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${item.value ? S.accent : "bg-stone-200"}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${item.value ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Menu items */}
      <div>
        <p className={`text-xs font-semibold ${S.muted} uppercase tracking-wider px-1 mb-2`}>Прочее</p>
        <div className={`${S.card} border ${S.border} rounded-2xl overflow-hidden divide-y ${S.divider}`}>
          {[
            { label: "Тарифный план", icon: "CreditCard", info: "Про · 50 ГБ" },
            { label: "Безопасность", icon: "ShieldCheck", info: "" },
            { label: "Поддержка", icon: "HelpCircle", info: "" },
          ].map(item => (
            <div key={item.label} className={`flex items-center gap-3 px-4 py-4 ${S.hover} active:bg-stone-50 transition-colors cursor-pointer`}>
              <div className={`w-8 h-8 rounded-xl ${S.accentBg} flex items-center justify-center`}>
                <Icon name={item.icon} size={15} className={S.accentText} />
              </div>
              <p className={`flex-1 text-sm font-medium ${S.text}`}>{item.label}</p>
              {item.info && <span className={`text-xs ${S.muted}`}>{item.info}</span>}
              <Icon name="ChevronRight" size={15} className={S.muted} />
            </div>
          ))}
        </div>
      </div>

      <button className="w-full py-3 rounded-2xl border border-red-100 text-red-400 text-sm font-semibold bg-red-50 active:bg-red-100 transition-colors">
        Выйти из аккаунта
      </button>
    </div>
  );
}

// --- Desktop layout (боковая панель) ---
const DESKTOP_NAV = [
  { id: "home" as Section, label: "Главная", icon: "LayoutDashboard" },
  { id: "files" as Section, label: "Файлы", icon: "FolderOpen" },
  { id: "search" as Section, label: "Поиск", icon: "Search" },
  { id: "favorites" as Section, label: "Избранное", icon: "Star" },
  { id: "settings" as Section, label: "Настройки", icon: "Settings" },
];

export default function Index() {
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [shareFile, setShareFile] = useState<FileItem | null>(null);

  const sectionTitle: Record<Section, string> = {
    home: "Главная",
    files: "Файлы",
    search: "Поиск",
    favorites: "Избранное",
    settings: "Настройки",
  };

  const renderScreen = () => {
    switch (activeSection) {
      case "home": return <HomeScreen onShare={setShareFile} onNav={setActiveSection} />;
      case "files": return <FilesScreen onShare={setShareFile} />;
      case "search": return <SearchScreen />;
      case "favorites": return <FavoritesScreen onShare={setShareFile} />;
      case "settings": return <SettingsScreen />;
    }
  };

  return (
    <div className={`min-h-screen ${S.bg} font-raleway flex items-start justify-center`}>

      {/* ===== MOBILE PROTOTYPE ===== */}
      <div className="flex md:hidden flex-col w-full min-h-screen">
        {/* Status bar */}
        <div className={`${S.card} border-b ${S.border} px-5 pt-3 pb-2 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 ${S.accent} rounded-md flex items-center justify-center`}>
              <Icon name="Layers" size={11} className="text-white" />
            </div>
            <span className={`font-bold text-sm ${S.text}`}>FileSpace</span>
          </div>
          <div className="flex items-center gap-2">
            <button className={`p-1.5 rounded-full ${S.hover} ${S.muted} relative`}>
              <Icon name="Bell" size={18} />
              <span className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${S.accent}`} />
            </button>
            <div className={`w-7 h-7 rounded-full ${S.accentBg} flex items-center justify-center text-xs font-bold ${S.accentText}`}>ИП</div>
          </div>
        </div>

        {/* Page header */}
        <div className="px-4 pt-5 pb-3">
          <h1 className={`text-xl font-bold ${S.text}`}>{sectionTitle[activeSection]}</h1>
          {activeSection === "home" && (
            <p className={`text-xs ${S.muted} mt-0.5`}>Добро пожаловать, Иван</p>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-24">
          {renderScreen()}
        </div>

        {/* Bottom navigation */}
        <div className={`fixed bottom-0 left-0 right-0 ${S.card} border-t ${S.border} px-2 pb-safe`}>
          <div className="flex">
            {BOTTOM_NAV.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                  activeSection === item.id ? S.accentText : S.muted
                }`}
              >
                <Icon name={item.icon} size={item.id === "search" ? 22 : 20} />
                <span className={`text-[10px] font-semibold`}>{item.label}</span>
                {activeSection === item.id && (
                  <span className={`absolute bottom-1 w-1 h-1 rounded-full ${S.accent}`} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== DESKTOP LAYOUT ===== */}
      <div className="hidden md:flex w-full h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className={`w-56 flex flex-col bg-[hsl(36,30%,97%)] border-r ${S.border} flex-shrink-0`}>
          <div className={`flex items-center gap-2.5 px-4 py-4 border-b ${S.border}`}>
            <div className={`w-6 h-6 ${S.accent} rounded-md flex items-center justify-center`}>
              <Icon name="Layers" size={13} className="text-white" />
            </div>
            <span className={`font-bold ${S.text} text-sm`}>FileSpace</span>
          </div>
          <nav className="flex-1 px-2 py-3 space-y-0.5">
            {DESKTOP_NAV.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? `${S.accent} text-white`
                    : `${S.muted} ${S.hover} hover:text-[hsl(24,20%,22%)]`
                }`}
              >
                <Icon name={item.icon} size={15} />
                {item.label}
              </button>
            ))}
          </nav>
          <div className={`px-3 py-4 border-t ${S.border}`}>
            <div className="flex items-center gap-2.5 px-1">
              <div className={`w-7 h-7 rounded-full ${S.accentBg} flex items-center justify-center text-xs font-bold ${S.accentText}`}>ИП</div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold ${S.text} truncate`}>Иван Петров</p>
                <p className={`text-xs ${S.muted}`}>Про-план · 50 ГБ</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className={`flex items-center justify-between px-6 py-4 ${S.card} border-b ${S.border}`}>
            <h1 className={`text-sm font-semibold ${S.text}`}>{sectionTitle[activeSection]}</h1>
            <div className="flex items-center gap-2">
              <button className={`p-2 rounded-lg ${S.hover} ${S.muted} transition-colors relative`}>
                <Icon name="Bell" size={15} />
                <span className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ${S.accent}`} />
              </button>
              <button className={`flex items-center gap-1.5 px-3 py-1.5 ${S.accent} text-white text-xs rounded-lg ${S.accentHover} transition-colors font-semibold`}>
                <Icon name="Upload" size={12} />Загрузить
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6 max-w-2xl">
            {renderScreen()}
          </div>
        </main>
      </div>

      {shareFile && <ShareSheet file={shareFile} onClose={() => setShareFile(null)} />}
    </div>
  );
}
