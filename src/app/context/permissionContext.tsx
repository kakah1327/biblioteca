// app/context/PermissionContext.tsx
'use client'; // Para indicar que este é um componente do lado do cliente

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipos de usuários
export type UserType = 'FUNCIONARIO' | 'CLIENTE';

// Tipos de permissões para os dois tipos de usuários
const permissions = {
  FUNCIONARIO: ['view-dashboard', 'manage-users', 'view-livros', 'create-livros', 'edit-livros'],
  CLIENTE: ['view-dashboard', 'view-livros', 'borrow-livros'],
};

// Definindo a estrutura do contexto
interface PermissionContextType {
  userType: UserType; // Tipo de usuário
  permissions: string[]; // Permissões do usuário
  setUserType: (userType: UserType) => void; // Função para definir o tipo de usuário
  hasPermission: (permission: string) => boolean; // Verifica se o usuário tem a permissão
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

// Hook para usar o contexto
export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};

interface PermissionProviderProps {
  children: ReactNode;
}

export const PermissionProvider = ({ children }: PermissionProviderProps) => {
  const [userType, setUserType] = useState<UserType>('CLIENTE'); // Definido como CLIENTE por padrão
  const [permissionsList, setPermissionsList] = useState<string[]>(permissions[userType]);

  const setUserTypeAndPermissions = (userType: UserType) => {
    setUserType(userType);
    setPermissionsList(permissions[userType]); // Atualiza as permissões conforme o tipo de usuário
  };

  const hasPermission = (permission: string) => permissionsList.includes(permission);

  return (
    <PermissionContext.Provider value={{ userType, permissions: permissionsList, setUserType: setUserTypeAndPermissions, hasPermission }}>
      {children}
    </PermissionContext.Provider>
  );
};
