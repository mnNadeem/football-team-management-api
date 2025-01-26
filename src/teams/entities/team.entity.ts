import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { Player } from "src/players/entities/player.entity"
import { User } from "src/users/entities/user.entity"

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number

  @Column()
  @ApiProperty()
  name: string

  @Column({ type: "decimal", precision: 10, scale: 2 })
  @ApiProperty()
  budget: number

  @OneToMany(
    () => Player,
    (player) => player.team,
  )
  @ApiProperty({ type: () => [Player] })
  players: Player[]

  @OneToOne(() => User)
  @JoinColumn()
  @ApiProperty({ type: () => User })
  user: User
}

