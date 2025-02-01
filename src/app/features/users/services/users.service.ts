import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { User } from '../models/user.model';
import { mockUsers } from '../constants/users.constants';
import { createId } from '../../../core/utils/create-id';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = 'https://dev.supracontrol.com:8080/api/User/';
  private http = inject(HttpClient);
  private usersSubject = new BehaviorSubject<User[]>(mockUsers);
  users$ = this.usersSubject.asObservable();

  getAllUsers(): Observable<User[]> {
    /*return this.http.get<User[]>(this.apiUrl).pipe(
      tap((users) => {
        this.usersSubject.next(users);
      }),
      catchError((error) => {
        console.error('Error fetching users', error);
        return of([]);
      })
    );*/
    this.usersSubject.next(mockUsers);

    return of(this.usersSubject.value);
  }

  addUser(newUser: User): Observable<User[]> {
    const currentUsers = this.usersSubject.value;
    const updatedUser = {
      ...newUser,
      id: createId(),
    };

    this.usersSubject.next([updatedUser, ...currentUsers]);

    return of(this.usersSubject.value);
  }

  editUser(updatedUser: User): Observable<User[]> {
    const currentUsers = this.usersSubject.value;
    const updatedUsers = currentUsers.map((user) =>
      user.id === updatedUser.id ? { ...updatedUser } : user
    );

    this.usersSubject.next(updatedUsers);

    return of(updatedUsers);
  }

  deleteUser(id: string): Observable<User[]> {
    const currentUsers = this.usersSubject.value;
    const updatedUsers = currentUsers.filter((user) => user.id !== id);
    if (updatedUsers.length !== currentUsers.length) {
      this.usersSubject.next(updatedUsers);
      return of(updatedUsers);
    } else {
      console.error('User not found');
      return of(currentUsers);
    }
  }
}
