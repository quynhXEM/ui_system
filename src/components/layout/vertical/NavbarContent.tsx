'use client'

// Third-party Imports
import classnames from 'classnames'

// Component Imports

import NavToggle from './NavToggle'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'
import LanguageDropdown from '@components/layout/shared/LanguageDropdown'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import TeamsDropdown from '../shared/TeamsDropdown'

const NavbarContent = () => {

  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      <div className='flex items-center gap-4'>
        <NavToggle />
        <ModeDropdown />
        <TeamsDropdown />
      </div>
      <div className='flex items-center'>
        <LanguageDropdown />
        <UserDropdown />
      </div>
    </div>
  )
}

export default NavbarContent