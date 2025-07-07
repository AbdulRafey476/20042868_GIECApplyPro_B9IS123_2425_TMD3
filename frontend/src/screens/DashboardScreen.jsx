import { Row, Col, Breadcrumb } from 'react-bootstrap';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useSpecificUserQuery } from '../slices/usersApiSlice.js';
import { setBranchName } from '../slices/authSlice';
import { useDispatch } from 'react-redux';
import Sidebar from '../components/Sidebar.jsx';
import Loader from '../components/Loader.jsx';
import { useEffect, useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

const Dashboard = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const { data: user, isLoading, refetch, error } = useSpecificUserQuery();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [, setBranchNameState] = useState('');

  useEffect(() => {
    if (user === null) {
      refetch();
    }
  }, [user, refetch, error, navigate]);

  useEffect(() => {
    if (user) {
      const isAdmin = user?.profile?.isAdmin;
      const name = isAdmin ? 'GIEC HEAD OFFICE' : user?.profile?.branch_id?.name;
      setBranchNameState(name || '');
      dispatch(setBranchName(name || ''));
      refetch();
    }
  }, [user, dispatch, refetch]);

  if (isLoading) {
    return <Loader />;
  }

  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <Row>
      {sidebarOpen && (
        <Col md={2} className="sidebar" style={{ backgroundColor: '#ffff', height: 'auto', position: 'relative' }}>
          <FiX
            size={24}
            style={{ position: 'absolute', top: '10px', right: '10px', color: 'black', transitionDuration: '1000' }}
            className="toggle-icon"
            role="button"
            onClick={() => setSidebarOpen(false)}
          />
          <Sidebar />
        </Col>
      )}
      <Col md={sidebarOpen ? 10 : 12} style={{ background: '#f8f8f8' }}>
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            {!sidebarOpen && (
              <FiMenu
                size={24}
                className="toggle-icon"
                role="button"
                onClick={() => setSidebarOpen(true)}
              />
            )}
            <Breadcrumb>
              <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
                Home
              </Breadcrumb.Item>
              {pathnames.map((value, index) => {
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                return (
                  <Breadcrumb.Item key={to} linkAs={Link} linkProps={{ to }} active={index === pathnames.length - 1}>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </Breadcrumb.Item>
                );
              })}
            </Breadcrumb>
          </div>

          <Outlet />
        </div>
      </Col>
    </Row>
  );
};

export default Dashboard;
