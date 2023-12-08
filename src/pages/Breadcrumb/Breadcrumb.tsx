import React from "react";
import { Link } from "react-router-dom";

type BreadcrumbProps = {
    paths: { name: string; path: string }[];
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ paths }) => {
    return (
        <nav aria-label="breadcrumb" className="absolute top-0 left-2 z-10">
            <ol className="breadcrumb flex text-sm">
                {paths.map((path, index) => {
                    const isLast = index === paths.length - 1;
                    return (
                        <React.Fragment key={path.name}>
                            {index > 0 && (
                                <span
                                    className="mx-1 text-gray-500 text-lg dark:text-gray-400">
                                    /
                                </span>
                            )}
                            {isLast ? (
                                <li
                                    className="breadcrumb-item active text-black text-lg dark:text-white"
                                    aria-current="page"
                                >
                                    {path.name}
                                </li>
                            ) : (
                                <li className="breadcrumb-item text-gray-500 text-lg dark:text-gray-400">
                                    <Link
                                        to={path.path}
                                        className="hover:text-gray-700 dark:hover:text-gray-200"
                                    >
                                        {path.name}
                                    </Link>
                                </li>
                            )}
                        </React.Fragment>
                    );
                })}
            </ol>
        </nav>
    );
};
