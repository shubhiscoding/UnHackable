import React, { useState } from 'react'
import { HardHat, RefreshCcw, CircleDollarSign, Menu, PieChart, X, HelpCircleIcon, Wallet, LockIcon } from 'lucide-react'
import { IconBrandGithub, IconBrandLinkedin, IconBrandTwitter } from '@tabler/icons-react'

const MenuItem = ({ icon: Icon, label, isActive = false, onClick, isCollapsed }: { 
  icon: React.ElementType, 
  label: string, 
  isActive?: boolean, 
  onClick?: () => void,
  isCollapsed?: boolean
}) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-2 text-l font-semibold transition-colors ${
      isActive
        ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
        : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
    } ${isCollapsed ? 'justify-center' : ''}`}
    title={isCollapsed ? label : undefined}
  >
    <Icon className="w-6 h-6 mr-3 min-w-[1rem]" />
    {!isCollapsed && <span className="truncate">{label}</span>}
  </button>
)

const MenuGroup = ({ label, children, isCollapsed }: { 
  label?: string, 
  children: React.ReactNode,
  isCollapsed?: boolean
}) => (
  <div className="mb-4">
    {!isCollapsed && label && (
      <h3 className="px-4 mb-1 text-xs font-semibold text-zinc-500 uppercase">
        {label}
      </h3>
    )}
    {children}
  </div>
)

interface CustomSidebarProps {
  title: string,
  setTitle: (title: string) => void
}

export default function CustomSidebar(props: CustomSidebarProps) {
  const [isOpen, setIsOpen] = useState(true)

  const toggleSidebar = () => setIsOpen(!isOpen)
  const onClick = (name: string) =>{
    props.setTitle(name);
    if(window.innerWidth < 1024){
      toggleSidebar();
    }
  }

  return (
    <>
      <aside 
        className={`
          inset-y-0 left-0 z-40 
          ${isOpen ? 'w-80' : 'w-16'} 
          bg-black text-zinc-400 
          transform transition-all duration-300 ease-in-out 
          md:translate-x-0
          max-xl:z-20
          max-xl:fixed
          ${!isOpen && "max-xl:h-fit"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-r border-zinc-900 h-20">
            <div className="flex items-center w-full">
              {isOpen ? (
                <>
                  <div className="flex justify-center items-center p-[0.4rem] w-8 h-8 mr-2 bg-zinc-800 rounded-full overflow-hidden">
                    <LockIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-xl font-bold text-zinc-100">UnHackable</p>
                  </div>
                  <button
                    onClick={toggleSidebar}
                    className="p-2 bg-[rgba(42,41,41,0.29)] rounded-md text-zinc-100"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </>
              ) : (
                <button
                  onClick={toggleSidebar}
                  className="w-full flex justify-center p-2 bg-[rgba(42,41,41,0.29)] rounded-full text-zinc-100"
                >
                  <Menu className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className={`flex-1 overflow-y-auto py-4 ${!isOpen && "max-md:hidden max-xl:hidden"}`}>
            <MenuGroup isCollapsed={!isOpen}>
              <MenuItem 
                icon={HardHat} 
                label="Generate Wallet"
                isActive={props.title == "Generate Wallet"? true: false} 
                isCollapsed={!isOpen}
                onClick={() => onClick("Generate Wallet")}
              />
              <MenuItem 
                icon={RefreshCcw} 
                isActive={props.title == "Recover Wallet"? true: false}
                label="Recover Wallet" 
                isCollapsed={!isOpen}
                onClick={() => onClick("Recover Wallet")}
              />
              <MenuItem 
                icon={Wallet} 
                isActive={props.title == "My Wallets"? true: false}
                label="My Wallets" 
                isCollapsed={!isOpen}
                onClick={() => onClick("My Wallets")}
              />
              <MenuItem 
                icon={PieChart} 
                isActive={props.title == "Protfolio"? true: false}
                label="Protfolio" 
                isCollapsed={!isOpen}
                onClick={() => onClick("Protfolio")}
              />
              <MenuItem 
                icon={CircleDollarSign} 
                isActive={props.title == "Support UnHackable"? true: false}
                label="Support UnHackable" 
                isCollapsed={!isOpen}
                onClick={() => onClick("Support UnHackable")}
              />
            </MenuGroup>

            <MenuGroup label="Report ISSUE" isCollapsed={!isOpen}>
              <MenuItem 
                icon={IconBrandGithub} 
                label="View Code" 
                isCollapsed={!isOpen}
                onClick={() => {
                  window.open('https://github.com/shubhiscoding/UnHackable', '_blank')
                }}
              />
              <MenuItem 
                icon={HelpCircleIcon} 
                label="Help" 
                isCollapsed={!isOpen}
              />
            </MenuGroup>

            <MenuGroup label="Builder Socials" isCollapsed={!isOpen}>
              <MenuItem 
                icon={IconBrandGithub} 
                label="shubhiscoding" 
                isCollapsed={!isOpen}
                onClick={() => {
                  window.open('https://github.com/shubhiscoding/', '_blank')
                }}
              />
              <MenuItem 
                icon={IconBrandTwitter} 
                label="LookWhatIbuild" 
                isCollapsed={!isOpen}
                onClick={() => {
                  window.open('https://X.com/LookWhatIbuild', '_blank')
                }}
              />
              <MenuItem 
                icon={IconBrandLinkedin} 
                label="Shubh Kesharwani" 
                isCollapsed={!isOpen}
                onClick={() => {
                  window.open('https://www.linkedin.com/in/shubh-kesharwani-29737427a/', '_blank')
                }}
              />
            </MenuGroup>
          </nav>
        </div>
      </aside>
    </>
  )
}