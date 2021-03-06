import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IUserResponse } from '../../interfaces/IUserResponse';
import { IauthContext, IUsercontext, IProvider } from './interface';
import toastMsg, { ToastType } from '../../utils/toastMsg';
import HttpClient from '../../services/httpClient';

export const AuthContext = createContext<IauthContext>({} as IauthContext);

export const AuthProvider = ({ children }: IProvider): React.ReactElement => {
  const [token, setToken] = useState<string>('');
  const [userAdm, setUserAdm] = useState<IUsercontext>({} as IUsercontext);
  const navigate = useNavigate();

  // if (userAdm.admin === 'Administrador') {
  //   const adm = false;
  // } else {
  //   const adm = true;
  // }

  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    const userPermission = localStorage.getItem('userPermission');
    const userId = localStorage.getItem('userID');
    if (userToken) {
      setToken(userToken);
      setUserAdm({
        id: userId,
        admin: userPermission,
      });
    }
  }, []);

  const handleLogin = (resToken: string, resUser: IUserResponse): void => {
    try {
      // const adm = !!resUser.admin;
      // console.log(resUser);
      setToken(resToken);
      setUserAdm({
        id: resUser.id,
        admin: resUser.admin ? 'Administrador' : 'Colaborador',
      });
      localStorage.setItem('userToken', resToken);
      localStorage.setItem('userPermission', resUser.admin ? 'Administrador' : 'Colaborador');

      localStorage.setItem('userID', resUser.id);
      if (resToken) {
        HttpClient.api.defaults.headers.common.Authorization = `Bearer ${resToken}`;
        navigate('/List');
      }
    } catch (error) {
      toastMsg(ToastType.Error, (error as Error).message);
    }
  };

  const handleSignOut = (): void => {
    setToken('');
    setUserAdm({});

    localStorage.removeItem('userToken');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ token, handleLogin, handleSignOut, userAdm, signed: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
