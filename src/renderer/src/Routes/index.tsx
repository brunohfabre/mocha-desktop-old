import { Router, Route } from 'electron-router-dom'

import { AuthLayout } from '../pages/_layouts/AuthLayout'
import { DefaultLayout } from '../pages/_layouts/DefaultLayout'
import { InternalLayout } from '../pages/_layouts/InternalLayout'
import { Collections } from '../pages/Collections'
import { Collection } from '../pages/Collections/Collection'
import { CreateCollection } from '../pages/Collections/CreateCollection'
import { Home } from '../pages/Home'
import { Organizations } from '../pages/Organizations'
import { CreateOrganization } from '../pages/Organizations/CreateOrganization'
import { Organization } from '../pages/Organizations/Organization'
import { SignIn } from '../pages/SignIn'
import { SignUp } from '../pages/SignUp'
import { Protected } from './Protected'

export function Routes() {
  return (
    <Router
      main={
        <>
          <Route element={<AuthLayout />}>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Route>

          <Route element={<Protected />}>
            <Route element={<DefaultLayout />}>
              <Route path="/" element={<Home />} />

              <Route path="/collections" element={<Collections />} />
            </Route>

            <Route element={<InternalLayout />}>
              <Route path="/organizations" element={<Organizations />} />
              <Route path="/organizations/:id" element={<Organization />} />

              <Route
                path="/organizations/create"
                element={<CreateOrganization />}
              />

              <Route
                path="/collections/create"
                element={<CreateCollection />}
              />
              <Route
                path="/collections/:collectionId"
                element={<Collection />}
              />
            </Route>
          </Route>
        </>
      }
    />
  )
}
