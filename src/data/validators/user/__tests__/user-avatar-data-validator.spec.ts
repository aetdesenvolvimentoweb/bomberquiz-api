import { InMemoryUserRepository } from "@/data/repositories";
import { UserAvatarData, UserCreateData } from "@/domain/entities";
import {
  InvalidParamError,
  MissingParamError,
  UnregisteredParamError,
} from "@/domain/errors";
import { UserRepository } from "@/domain/repositories";
import {
  IdValidatorUseCase,
  UserAvatarDataValidatorUseCase,
} from "@/domain/validators";

import { UserAvatarDataValidator } from "../user-avatar-data-validator";

interface SutResponse {
  sut: UserAvatarDataValidatorUseCase;
  userRepository: UserRepository;
  idValidator: IdValidatorUseCase;
}

const makeSut = (): SutResponse => {
  const idValidator = jest.mocked<IdValidatorUseCase>({
    validate: jest.fn().mockImplementation(() => {}),
  });
  const userRepository = new InMemoryUserRepository();
  const sut = new UserAvatarDataValidator({
    idValidator,
    userRepository,
  });

  return { sut, userRepository, idValidator };
};

describe("UserAvatarDataValidator", () => {
  const userCreateData: UserCreateData = {
    name: "any_name",
    email: "any_mail@mail.com",
    phone: "(62) 99999-9999",
    birthdate: new Date("1990-01-01"),
    password: "P@ssw0rd",
  };

  it("deve passar se dados fornecidos forem corretos", async () => {
    const { sut, userRepository } = makeSut();

    await userRepository.create(userCreateData);
    const user = await userRepository.findByEmail(userCreateData.email);

    await expect(
      sut.validate({ id: user!.id, avatarUrl: "novo_avatar_url" }),
    ).resolves.not.toThrow();
  });

  it("IdValidator deve ser chamado com id correto", async () => {
    const { sut, userRepository, idValidator } = makeSut();
    const idValidatorSpy = jest.spyOn(idValidator, "validate");

    await userRepository.create(userCreateData);
    const user = await userRepository.findByEmail(userCreateData.email);

    await sut.validate({ id: user!.id, avatarUrl: "novo_avatar_url" });

    expect(idValidatorSpy).toHaveBeenCalledWith(user?.id);
  });

  it("deve falhar se Id do usuário não for fornecido", async () => {
    const { sut } = makeSut();

    await expect(
      sut.validate({ avatarUrl: "novo_avatar_url" } as UserAvatarData),
    ).rejects.toThrow(new MissingParamError("Id"));
  });

  it("deve falhar se avatar url não for fornecido", async () => {
    const { sut } = makeSut();

    await expect(
      sut.validate({ id: "any_id" } as UserAvatarData),
    ).rejects.toThrow(new MissingParamError("avatar"));
  });

  it("deve falhar se o id fornecido para o usuário for inválido", async () => {
    const { sut, idValidator } = makeSut();
    jest.spyOn(idValidator, "validate").mockImplementation(() => {
      throw new InvalidParamError("id");
    });

    await expect(
      sut.validate({ id: "invalid_id", avatarUrl: "novo_avatar_url" }),
    ).rejects.toThrow(new InvalidParamError("id"));
  });

  it("deve falhar se o id fornecido não estiver registrado no sistema", async () => {
    const { sut } = makeSut();

    await expect(
      sut.validate({ id: "valid_id", avatarUrl: "novo_avatar_url" }),
    ).rejects.toThrow(new UnregisteredParamError("id"));
  });
});
