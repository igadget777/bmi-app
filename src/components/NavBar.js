import React from 'react'
import { PageHeader, Button, Typography } from 'antd';
const { Text } = Typography;


const NavBar = ({ signOut, user }) => {
  return (
    <PageHeader
      className="site-page-header"
      // onBack={() => null}
      title="BMI Calculator"
      // subTitle="This is a subtitle"
      extra={[
        <Text key="1">Welcome {user.attributes.email}.</Text>,
        <Button key="2" onClick={signOut}>Sign out</Button>
      ]}
    />
  )
}

export default NavBar