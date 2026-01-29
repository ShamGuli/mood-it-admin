import Link from 'next/link';

interface Breadcrumb {
  label: string;
  href: string;
}

interface Props {
  title: string;
  breadcrumbs: Breadcrumb[];
}

export default function PageHeader({ title, breadcrumbs }: Props) {
  return (
    <div className="page-header">
      {/* Grid Lines */}
      <div className="grid-lines">
        <div className="grid-line-1"></div>
        <div className="grid-line-2"></div>
        <div className="grid-line-3"></div>
        <div className="grid-line-4"></div>
        <div className="grid-line-5"></div>
      </div>

      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-12">
            <div className="page-header-box">
              <h1 className="wow fadeInUp" data-cursor="-opaque">
                <span>{title}</span>
              </h1>
              <nav className="wow fadeInUp" data-wow-delay="0.2s">
                <ol className="breadcrumb">
                  {breadcrumbs.map((crumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;
                    return (
                      <li
                        key={crumb.href}
                        className={`breadcrumb-item ${isLast ? 'active' : ''}`}
                        {...(isLast && { 'aria-current': 'page' })}
                      >
                        {isLast ? (
                          crumb.label
                        ) : (
                          <Link href={crumb.href}>{crumb.label}</Link>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
