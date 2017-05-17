declare var require: any;

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { MutationOptions } from 'apollo-client'
import { ApolloQueryResult, ApolloError } from 'apollo-client';
import { DocumentNode } from 'graphql';
import { Observer } from 'rxjs';

import { ValidationService } from 'app/app-module/services/validation.service';
import { AuthService } from 'app/app-module/services/auth.service';
import { LoginMutation } from '../../../graphql/schema';


// todo figure out how to refactor this to not use require
const LoginMutationNode: DocumentNode =
  require('graphql-tag/loader!../../../graphql/Login.graphql');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {

  public form: FormGroup;
  public usernameOrEmail: FormControl;
  public password: FormControl;

  constructor(private apollo: Apollo) {
    this.initForm();
  }

  initForm() {
    this.usernameOrEmail =
      new FormControl('', [
        Validators.required,
        ValidationService.minAndMaxLengthValidator({
          minLength: 2,
          maxLength: 12,
      })]);
    this.password =
      new FormControl('', ValidationService.passwordValidator);

    this.form = new FormGroup({
      usernameOrEmail: this.usernameOrEmail,
      password: this.password,
    });
  }

  getLoginObserver(): Observer<ApolloQueryResult<LoginMutation>> {
    const next = ({ data }) =>
      AuthService.setJwtToken(data.login.token);
    const handledErrors = ['loginFailed'];
    const error = ValidationService.getErrorHandler({
      handledErrors,
      form: this.form,
    });
    const complete = () => console.log('complete');
    return { next, error, complete };
  }

  getLoginMutationOptions(): MutationOptions {
    return {
      mutation: LoginMutationNode,
      variables: this.form.value,
    };
  }

  submit() {
    this.apollo.mutate<LoginMutation>(
      this.getLoginMutationOptions()
    )
      .subscribe(this.getLoginObserver());
  }

}
