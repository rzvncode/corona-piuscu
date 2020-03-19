import "reflect-metadata"
import './site.scss'
import 'bootstrap'
import "./shims"
import { App, Component } from 'solenya'
import { Master } from './app/master'

new App (Master, "app")