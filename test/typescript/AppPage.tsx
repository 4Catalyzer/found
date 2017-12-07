import * as React from 'react'
import { Link } from 'found'

function AppPage({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <ul>
                <li>
                    <Link to="/" activeClassName="active" exact>
                        Main
                    </Link>
                </li>
                <li>
                    <Link to="/widgets/foo" activeClassName="active">
                        Foo widget
                    </Link>
                </li>
            </ul>

            {children}
        </div>
    )
}

export default AppPage
