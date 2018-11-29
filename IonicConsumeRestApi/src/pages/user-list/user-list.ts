import { UsersProvider } from './../../providers/users/users';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, InfiniteScroll } from 'ionic-angular';
import { ViewChild } from '@angular/core';

@IonicPage()
@Component({
  selector: 'page-user-list',
  templateUrl: 'user-list.html',
})
export class UserListPage {
  users: any[];
  
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;

  constructor(public navCtrl: NavController, public navParams: NavParams, private toast: ToastController, private userProvider: UsersProvider) { }

  ionViewDidEnter() {
    this.users = [];
    
    this.infiniteScroll.enable(true);
    this.getAllUsers();
  }

  getAllUsers() {
    this.userProvider.getAll()
      .then((result: any) => {
        for (var i = 0; i < result.length; i++) {
          var user = result[i];
          this.users.push(user);
        }

        if (this.infiniteScroll) {
          this.infiniteScroll.complete();
          if (this.users.length == result.total) {
            this.infiniteScroll.enable(false);
          }
        }
      })
      .catch((error: any) => {
        this.toast.create({ message: 'Erro ao listar os usuários. Erro: ' + error.error, position: 'botton', duration: 3000 }).present();
      });
  }

  getUsers() {
    setTimeout(() => {
      
      this.getAllUsers();
    }, 500);
  }

  openUser(id: number) {
    this.userProvider.get(id)
      .then((result: any) => {
        this.navCtrl.push('UserDetailPage', { user: result.data });
      })
      .catch((error: any) => {
        this.toast.create({ message: 'Erro ao recuperar o usuário. Erro: ' + error.error, position: 'botton', duration: 3000 }).present();
      });

  }

  openCreateUser() {
    this.navCtrl.push('UserEditPage');
  }

  openEditUser(id: number) {
    this.userProvider.get(id)
      .then((result: any) => {
        this.navCtrl.push('UserEditPage', { user: result.data });
      })
      .catch((error: any) => {
        this.toast.create({ message: 'Erro ao recuperar o usuário. Erro: ' + error.error, position: 'botton', duration: 3000 }).present();
      });
  }

  deleteUser(user: any) {
    this.userProvider.remove(user.id)
      .then((result: any) => {
        let index = this.users.indexOf(user);
        this.users.splice(index, 1);

        this.toast.create({ message: 'Usuário excluído com sucesso.', position: 'botton', duration: 3000 }).present();
      })
      .catch((error: any) => {
        this.toast.create({ message: 'Erro ao excluir o usuário. Erro: ' + error.error, position: 'botton', duration: 3000 }).present();
      });
  }
}
