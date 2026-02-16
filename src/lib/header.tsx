import { StartMenu } from './components/construct/MenuButton';
import { DateTimeBlock } from './components/construct/DateTimeBlock';
import { LogOutBlock } from './components/construct/LogOut';

export const Header = () => {
  return (
    <header className="flex items-center justify-between px-4 h-14 bg-[#0f172a] border-b border-white/10">
      <div className="flex items-center gap-4">
        <StartMenu />
      </div>
      <div className="flex items-center gap-1">
        <DateTimeBlock />
        <div className="h-10 w-[1px] bg-gray-600" />
        <LogOutBlock />
      </div>
    </header>
  );
};
