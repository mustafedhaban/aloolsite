import type { Access, FieldAccess } from 'payload'
export const staff: Access = ({ req }) => Boolean(req.user)
export const admin: Access = ({ req }) => req.user?.role === 'admin'
export const adminField: FieldAccess = ({ req }) => req.user?.role === 'admin'
export const adminOrSelf: Access = ({ req }) => req.user?.role === 'admin' ? true : req.user ? { id: { equals: req.user.id } } : false
export const published: Access = ({ req }) => req.user ? true : { _status: { equals: 'published' } }
