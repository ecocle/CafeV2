import React from 'react';
import { Breadcrumbs, Typography, useMediaQuery } from '@mui/material';
import Link, { LinkProps } from '@mui/material/Link';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import styles from './Breadcrumb.module.scss';

const breadcrumbNameMap: { [key: string]: string } = {
    '/': 'Home',
    '/coffee': 'Coffee',
    '/caffeine-free': 'Non-Caffeinated',
    '/breakfast': 'Breakfast',
    '/coffee/order': 'Order',
    '/caffeine-free/order': 'Order',
    '/breakfast/order': 'Order',
    '/signup': 'Sign Up',
    '/signin': 'Sign In',
    '/orders': 'View Orders'
};

interface LinkRouterProps extends LinkProps {
    to: string;
    replace?: boolean;
}

function LinkRouter(props: LinkRouterProps) {
    return <Link {...props} component={RouterLink as any} />;
}

const Breadcrumb = () => {
    const location = useLocation();
    const pathNames = location.pathname.split('/').filter((x) => x);
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <div className={styles.container}>
            <Breadcrumbs aria-label='breadcrumb'>
                {
                    isMobile ? (
                        <Typography>
                            <LinkRouter underline='hover' to='/' className={styles.LinkRouter}>
                                Home
                            </LinkRouter>
                        </Typography>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>
                <LinkRouter underline='hover' to='/' className={styles.LinkRouter}>
                    Home
                </LinkRouter>
            </span>
                            {pathNames.map((value, index) => {
                                const routeTo = `/${pathNames.slice(0, index + 1).join('/')}`;
                                const primary = breadcrumbNameMap[routeTo];
                                const isLast = index === pathNames.length - 1;

                                return (
                                    <React.Fragment key={routeTo}>
                                        <span style={{ margin: '0 0.5rem' }}>/</span>
                                        {isLast ? (
                                            <Typography className={styles.Current}>
                                                {primary}
                                            </Typography>
                                        ) : (
                                            <span>
                                <LinkRouter
                                    underline='hover'
                                    to={routeTo}
                                    className={styles.LinkRouter}
                                >
                                    {primary}
                                </LinkRouter>
                            </span>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    )
                }

            </Breadcrumbs>
        </div>
    );
};

export default Breadcrumb;
